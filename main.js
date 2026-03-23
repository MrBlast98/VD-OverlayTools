const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron');
const path = require('path');
let autoUpdater = null;
try {
  const { autoUpdater: au } = require('electron-updater');
  autoUpdater = au;
} catch (e) {
  console.warn('electron-updater not installed, auto-updates will be disabled');
}

const APP_ICON_PATH = path.join(__dirname, 'images', 'app-icon.ico');
const DEFAULT_AUTH_SERVER_URL = 'https://idaho-discussions-lid-generates.trycloudflare.com';

let mainWindow = null;
const overlayWindows = new Map();
let authSession = {
  serverUrl: '',
  cookie: ''
};
let spotifyTokenCache = {
  clientId: '',
  clientSecret: '',
  token: '',
  expiresAt: 0
};

// Auto-updater configuration
if (autoUpdater) {
  autoUpdater.checkForUpdatesAndNotify();
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('update-available', () => {
    console.log('Update available, downloading...');
  });

  autoUpdater.on('update-downloaded', () => {
    if (mainWindow) {
      mainWindow.webContents.send('update-ready', {
        message: 'Update downloaded. Restart the app to apply the update.',
        version: autoUpdater.currentVersion.version
      });
    }
  });

  autoUpdater.on('error', (err) => {
    console.error('Auto-updater error:', err);
  });
}

function normalizeServerUrl(value) {
  const defaultServer = String(process.env.AUTH_SERVER_URL || DEFAULT_AUTH_SERVER_URL).trim();
  const raw = String(value || '').trim() || defaultServer;
  const withProto = /^https?:\/\//i.test(raw) ? raw : `http://${raw}`;
  const parsed = new URL(withProto);
  return `${parsed.protocol}//${parsed.host}`;
}

async function readResponseBody(response) {
  const contentType = String(response.headers.get('content-type') || '').toLowerCase();
  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return {};
    }
  }

  const text = await response.text();
  return { error: text };
}

function extractSessionCookie(response) {
  if (!response || !response.headers) return '';

  if (typeof response.headers.getSetCookie === 'function') {
    const list = response.headers.getSetCookie();
    if (Array.isArray(list) && list.length > 0) {
      const first = String(list[0] || '');
      if (first) return first.split(';')[0].trim();
    }
  }

  const raw = String(response.headers.get('set-cookie') || '');
  if (!raw) return '';
  return raw.split(';')[0].trim();
}

function mapITunesResult(item) {
  return {
    id: String(item.trackId || `${item.trackName || 'track'}-${item.artistName || 'artist'}`),
    name: item.trackName || 'Unknown Song',
    artists: [{ name: item.artistName || 'Unknown Artist' }],
    previewUrl: item.previewUrl || '',
    externalUrl: item.trackViewUrl || '',
    durationMs: Number(item.trackTimeMillis) || 0,
    coverUrl: item.artworkUrl100 || ''
  };
}

async function searchITunesTracks(query, limit) {
  const encodedQuery = encodeURIComponent(query);
  const response = await fetch(
    `https://itunes.apple.com/search?term=${encodedQuery}&entity=song&limit=${limit}`
  );

  if (!response.ok) {
    const txt = await response.text();
    throw new Error(`iTunes search failed (${response.status}): ${txt}`);
  }

  const data = await response.json();
  const items = Array.isArray(data && data.results ? data.results : []) ? data.results : [];
  return items.map(mapITunesResult);
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildQueryVariants(query) {
  const base = String(query || '').trim();
  if (!base) return [];

  const variants = new Set([base]);
  const withoutBrackets = base.replace(/\([^)]*\)|\[[^\]]*\]/g, ' ').replace(/\s+/g, ' ').trim();
  if (withoutBrackets) variants.add(withoutBrackets);

  const withoutFeat = withoutBrackets
    .replace(/\b(feat\.?|ft\.?|featuring)\b.*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (withoutFeat) variants.add(withoutFeat);

  // Add variants to include clean and explicit versions
  for (const variant of Array.from(variants)) {
    variants.add(`${variant} clean`);
    variants.add(`${variant} explicit`);
  }

  return Array.from(variants);
}

function trackIdentity(track) {
  const name = normalizeText(track && track.name ? track.name : '');
  const firstArtist = normalizeText(
    track && Array.isArray(track.artists) && track.artists[0] && track.artists[0].name
      ? track.artists[0].name
      : ''
  );
  if (name || firstArtist) return `${name}::${firstArtist}`;
  return String(track && track.id ? track.id : '');
}

function scoreTrack(track, queryTokens) {
  const title = normalizeText(track && track.name ? track.name : '');
  const artists = normalizeText(
    track && Array.isArray(track.artists)
      ? track.artists.map((a) => (a && a.name ? a.name : '')).join(' ')
      : ''
  );
  const titleArtist = `${title} ${artists}`.trim();

  let score = 0;
  for (const token of queryTokens) {
    if (!token) continue;
    if (title === token) score += 5;
    if (artists === token) score += 3;
    if (title.includes(token)) score += 3;
    if (artists.includes(token)) score += 2;
    if (titleArtist.includes(token)) score += 1;
  }

  if (title && queryTokens.length > 0 && queryTokens.every((token) => titleArtist.includes(token))) {
    score += 4;
  }

  return score;
}

function mergeTracks(primaryTracks, secondaryTracks, query, limit) {
  const queryTokens = normalizeText(query).split(' ').filter(Boolean);
  const indexed = new Map();

  for (const track of primaryTracks || []) {
    const key = trackIdentity(track);
    if (!key) continue;
    if (!indexed.has(key)) {
      indexed.set(key, { ...track, _sourceWeight: 2 });
    }
  }

  for (const track of secondaryTracks || []) {
    const key = trackIdentity(track);
    if (!key) continue;
    if (!indexed.has(key)) {
      indexed.set(key, { ...track, _sourceWeight: 1 });
      continue;
    }

    const existing = indexed.get(key);
    if (!existing.previewUrl && track.previewUrl) existing.previewUrl = track.previewUrl;
    if (!existing.externalUrl && track.externalUrl) existing.externalUrl = track.externalUrl;
    if ((!existing.coverUrl || existing.coverUrl.length < 10) && track.coverUrl) existing.coverUrl = track.coverUrl;
    if (!existing.durationMs && track.durationMs) existing.durationMs = track.durationMs;
  }

  const ranked = Array.from(indexed.values())
    .map((track) => ({
      ...track,
      _score: scoreTrack(track, queryTokens)
    }))
    .sort((a, b) => {
      if (b._score !== a._score) return b._score - a._score;
      return b._sourceWeight - a._sourceWeight;
    })
    .slice(0, limit)
    .map(({ _score, _sourceWeight, ...track }) => track);

  return ranked;
}

async function searchSpotifyTracks(token, query, limit) {
  const encodedQuery = encodeURIComponent(query);
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodedQuery}&type=track&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    const txt = await response.text();
    throw new Error(`Spotify search failed (${response.status}): ${txt}`);
  }

  const data = await response.json();
  const items = Array.isArray(data && data.tracks && data.tracks.items ? data.tracks.items : [])
    ? data.tracks.items
    : [];

  return items.map((item) => ({
    id: item.id,
    name: item.name || 'Unknown Song',
    artists: Array.isArray(item.artists)
      ? item.artists.map((a) => ({ name: a && a.name ? a.name : 'Unknown Artist' }))
      : [{ name: 'Unknown Artist' }],
    previewUrl: item.preview_url || '',
    externalUrl: item.external_urls && item.external_urls.spotify ? item.external_urls.spotify : '',
    durationMs: Number(item.duration_ms) || 0,
    coverUrl:
      item.album && Array.isArray(item.album.images) && item.album.images.length > 0
        ? item.album.images[Math.min(1, item.album.images.length - 1)].url
        : ''
  }));
}

async function getSpotifyAccessToken(clientId, clientSecret) {
  const now = Date.now();
  if (
    spotifyTokenCache.token &&
    spotifyTokenCache.clientId === clientId &&
    spotifyTokenCache.clientSecret === clientSecret &&
    now < spotifyTokenCache.expiresAt - 5000
  ) {
    return spotifyTokenCache.token;
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    const txt = await response.text();
    throw new Error(`Spotify token request failed (${response.status}): ${txt}`);
  }

  const data = await response.json();
  const token = String(data.access_token || '');
  const expiresIn = Number(data.expires_in) || 3600;

  spotifyTokenCache = {
    clientId,
    clientSecret,
    token,
    expiresAt: Date.now() + expiresIn * 1000
  };

  return token;
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    frame: false,
    autoHideMenuBar: true,
    icon: APP_ICON_PATH,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      backgroundThrottling: false
    }
  });
  mainWindow.webContents.setBackgroundThrottling(false);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
}

function normalizeOverlayMode(mode) {
  if (mode === '1v1') return '1v1';
  if (mode === '4v1') return '4v1';
  return 'map';
}

function createOverlayWindow(mode) {
  const overlayMode = normalizeOverlayMode(mode);
  const existing = overlayWindows.get(overlayMode);
  if (existing && !existing.isDestroyed()) return existing;

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: true,
    resizable: true,
    icon: APP_ICON_PATH,
    webPreferences: {
      preload: path.join(__dirname, 'overlay_preload.js'),
      backgroundThrottling: false
    }
  });
  win.loadFile(path.join(__dirname, 'src', 'overlay.html'));
  win.setAlwaysOnTop(true);
  win.on('closed', () => {
    overlayWindows.delete(overlayMode);
  });

  overlayWindows.set(overlayMode, win);
  return win;
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createMainWindow();
  // Check for updates after app is ready
  autoUpdater.checkForUpdates();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('open-overlay', (event, args) => {
  const mode = normalizeOverlayMode(args && args.mode ? args.mode : 'map');
  const overlayWindow = createOverlayWindow(mode);
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    overlayWindow.webContents.send('overlay-update', args);
    const alwaysOnTop = args && (args.alwaysOnTop === undefined ? true : !!args.alwaysOnTop);
    overlayWindow.setAlwaysOnTop(alwaysOnTop);
    if (args && typeof args.opacity === 'number' && Number.isFinite(args.opacity)) {
      overlayWindow.setOpacity(args.opacity);
    }
  }
  return true;
});

ipcMain.handle('close-overlay', (event, args) => {
  const modeArg = typeof args === 'string'
    ? args
    : (args && args.mode ? args.mode : '');

  if (modeArg) {
    const target = overlayWindows.get(normalizeOverlayMode(modeArg));
    if (target && !target.isDestroyed()) {
      target.close();
    }
    return true;
  }

  for (const [, win] of overlayWindows) {
    if (win && !win.isDestroyed()) {
      win.close();
    }
  }
  return true;
});

ipcMain.on('update-overlay', (event, args) => {
  if (!args || typeof args !== 'object') return;
  const modeArg = args.mode ? normalizeOverlayMode(args.mode) : '';

  if (modeArg) {
    const win = overlayWindows.get(modeArg);
    if (!win || win.isDestroyed()) return;
    win.webContents.send('overlay-update', args);
    if (args.alwaysOnTop !== undefined) {
      win.setAlwaysOnTop(!!args.alwaysOnTop);
    }
    if (typeof args.opacity === 'number' && Number.isFinite(args.opacity)) {
      win.setOpacity(args.opacity);
    }
    return;
  }

  for (const [, win] of overlayWindows) {
    if (!win || win.isDestroyed()) continue;
    win.webContents.send('overlay-update', args);
    if (args.alwaysOnTop !== undefined) {
      win.setAlwaysOnTop(!!args.alwaysOnTop);
    }
    if (typeof args.opacity === 'number' && Number.isFinite(args.opacity)) {
      win.setOpacity(args.opacity);
    }
  }
});

ipcMain.on('set-always-on-top', (event, val) => {
  for (const [, win] of overlayWindows) {
    if (win && !win.isDestroyed()) {
      win.setAlwaysOnTop(!!val);
    }
  }
});

ipcMain.on('set-opacity', (event, val) => {
  for (const [, win] of overlayWindows) {
    if (win && !win.isDestroyed()) {
      win.setOpacity(val);
    }
  }
});

ipcMain.handle('restart-app', () => {
  if (autoUpdater) {
    autoUpdater.quitAndInstall();
  } else {
    console.warn('autoUpdater not available');
    app.quit();
  }
});

ipcMain.handle('check-updates', async () => {
    if (!autoUpdater) {
      return { ok: false, error: 'Auto-updater not available' };
    }
  try {
    const result = await autoUpdater.checkForUpdates();
    return { ok: true, updateAvailable: !!result.updateInfo };
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : 'Update check failed' };
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('get-overlay-bounds', (event) => {
  const sourceWin = BrowserWindow.fromWebContents(event.sender);
  if (!sourceWin || sourceWin.isDestroyed()) return null;
  return sourceWin.getBounds();
});

ipcMain.on('set-overlay-bounds', (event, bounds) => {
  const sourceWin = BrowserWindow.fromWebContents(event.sender);
  if (!sourceWin || sourceWin.isDestroyed() || !bounds) return;

  const current = sourceWin.getBounds();
  const minWidth = 120;
  const minHeight = 80;

  const x = Number.isFinite(bounds.x) ? Math.round(bounds.x) : current.x;
  const y = Number.isFinite(bounds.y) ? Math.round(bounds.y) : current.y;
  const width = Number.isFinite(bounds.width) ? Math.max(minWidth, Math.round(bounds.width)) : current.width;
  const height = Number.isFinite(bounds.height) ? Math.max(minHeight, Math.round(bounds.height)) : current.height;

  sourceWin.setBounds({ x, y, width, height });
});

ipcMain.handle('choose-background-media', async () => {
  if (!mainWindow) return null;

  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Choose background media',
    properties: ['openFile'],
    filters: [
      {
        name: 'Media files',
        extensions: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'mp4', 'webm', 'ogg', 'mp3', 'wav']
      },
      { name: 'All files', extensions: ['*'] }
    ]
  });

  if (result.canceled || !result.filePaths || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

ipcMain.handle('choose-custom-font', async () => {
  if (!mainWindow) return null;

  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Choose custom font file',
    properties: ['openFile'],
    filters: [
      {
        name: 'Font files',
        extensions: ['ttf', 'otf', 'woff', 'woff2']
      },
      { name: 'All files', extensions: ['*'] }
    ]
  });

  if (result.canceled || !result.filePaths || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

ipcMain.handle('spotify-search-tracks', async (event, payload) => {
  try {
    const query = String(payload && payload.query ? payload.query : '').trim();
    const envClientId = String(process.env.SPOTIFY_CLIENT_ID || '').trim();
    const envClientSecret = String(process.env.SPOTIFY_CLIENT_SECRET || '').trim();
    const payloadClientId = String(payload && payload.clientId ? payload.clientId : '').trim();
    const payloadClientSecret = String(payload && payload.clientSecret ? payload.clientSecret : '').trim();
    const clientId = envClientId || payloadClientId;
    const clientSecret = envClientSecret || payloadClientSecret;
    const limitRaw = Number(payload && payload.limit ? payload.limit : 15);
    const limit = Math.max(1, Math.min(50, Number.isFinite(limitRaw) ? limitRaw : 15));

    if (!query) {
      return { ok: false, error: 'Search query is required.' };
    }

    // If Spotify credentials are not configured on developer side, fallback to iTunes.
    if (!clientId || !clientSecret) {
      const tracks = await searchITunesTracks(query, limit);
      return { ok: true, tracks, source: 'itunes' };
    }

    const token = await getSpotifyAccessToken(clientId, clientSecret);

    const variants = buildQueryVariants(query);
    const spotifyCandidates = [];

    for (const variant of variants) {
      const remaining = Math.max(1, limit - spotifyCandidates.length);
      const variantTracks = await searchSpotifyTracks(token, variant, Math.min(20, remaining + 5));
      spotifyCandidates.push(...variantTracks);
      if (spotifyCandidates.length >= limit) break;
    }

    let itunesCandidates = [];
    try {
      itunesCandidates = await searchITunesTracks(query, Math.min(50, limit * 2));
    } catch {
      itunesCandidates = [];
    }

    const mergedTracks = mergeTracks(spotifyCandidates, itunesCandidates, query, limit);
    const source = spotifyCandidates.length > 0 && itunesCandidates.length > 0
      ? 'mixed'
      : spotifyCandidates.length > 0
        ? 'spotify'
        : 'itunes';

    return { ok: true, tracks: mergedTracks, source };
  } catch (err) {
    try {
      const query = String(payload && payload.query ? payload.query : '').trim();
      const limitRaw = Number(payload && payload.limit ? payload.limit : 15);
      const limit = Math.max(1, Math.min(50, Number.isFinite(limitRaw) ? limitRaw : 15));
      if (!query) {
        return { ok: false, error: err && err.message ? err.message : 'Song lookup failed.' };
      }
      const tracks = await searchITunesTracks(query, limit);
      return { ok: true, tracks, source: 'itunes' };
    } catch {
      return { ok: false, error: err && err.message ? err.message : 'Song lookup failed.' };
    }
  }
});

ipcMain.handle('auth-login', async (event, payload) => {
  let serverUrl = '';
  try {
    serverUrl = normalizeServerUrl(payload && payload.serverUrl ? payload.serverUrl : '');
    const username = String(payload && payload.username ? payload.username : '').trim();
    const password = String(payload && payload.password ? payload.password : '');

    if (!username || !password) {
      return { ok: false, error: 'Username and password are required.' };
    }

    const response = await fetch(`${serverUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const body = await readResponseBody(response);
    if (!response.ok) {
      return { ok: false, error: body && body.error ? body.error : `Login failed (${response.status}).` };
    }

    const cookie = extractSessionCookie(response);
    authSession = {
      serverUrl,
      cookie
    };

    return {
      ok: true,
      serverUrl,
      user: body && body.user ? body.user : null
    };
  } catch (err) {
    const message = String(err && err.message ? err.message : '').toLowerCase();
    if (message.includes('fetch failed')) {
      return {
        ok: false,
        error: `Could not connect to auth server at ${serverUrl || 'the configured URL'}. Check that your server is online and reachable.`
      };
    }
    return { ok: false, error: err && err.message ? err.message : 'Could not connect to server.' };
  }
});

ipcMain.handle('auth-register', async (event, payload) => {
  let serverUrl = '';
  try {
    serverUrl = normalizeServerUrl(payload && payload.serverUrl ? payload.serverUrl : '');
    const inviteCode = String(payload && payload.inviteCode ? payload.inviteCode : '').trim();
    const email = String(payload && payload.email ? payload.email : '').trim();
    const username = String(payload && payload.username ? payload.username : '').trim();
    const password = String(payload && payload.password ? payload.password : '');

    if (!inviteCode || !email || !username || !password) {
      return { ok: false, error: 'Invite code, email, username, and password are required.' };
    }

    const response = await fetch(`${serverUrl}/api/auth/register-invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inviteCode, email, username, password })
    });

    const body = await readResponseBody(response);
    if (!response.ok) {
      return { ok: false, error: body && body.error ? body.error : `Register failed (${response.status}).` };
    }

    return {
      ok: true,
      serverUrl,
      message: body && body.message ? body.message : 'Account created successfully.'
    };
  } catch (err) {
    const message = String(err && err.message ? err.message : '').toLowerCase();
    if (message.includes('fetch failed')) {
      return {
        ok: false,
        error: `Could not connect to auth server at ${serverUrl || 'the configured URL'}. Check that your server is online and reachable.`
      };
    }
    return { ok: false, error: err && err.message ? err.message : 'Could not connect to server.' };
  }
});

ipcMain.handle('auth-me', async (event, payload) => {
  let serverUrl = '';
  try {
    const requestedServer = payload && payload.serverUrl ? normalizeServerUrl(payload.serverUrl) : '';
    serverUrl = requestedServer || authSession.serverUrl;
    if (!serverUrl || !authSession.cookie) {
      return { ok: false, error: 'Not authenticated.' };
    }

    const response = await fetch(`${serverUrl}/api/auth/me`, {
      headers: {
        Cookie: authSession.cookie
      }
    });

    const body = await readResponseBody(response);
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        authSession = { serverUrl, cookie: '' };
      }
      return { ok: false, error: body && body.error ? body.error : 'Not authenticated.' };
    }

    return {
      ok: true,
      serverUrl,
      user: body && body.user ? body.user : null
    };
  } catch (err) {
    const message = String(err && err.message ? err.message : '').toLowerCase();
    if (message.includes('fetch failed')) {
      return {
        ok: false,
        error: `Auth server is unreachable at ${serverUrl || 'the configured URL'}.`
      };
    }
    return { ok: false, error: err && err.message ? err.message : 'Auth check failed.' };
  }
});

ipcMain.handle('auth-logout', async () => {
  try {
    if (authSession.serverUrl && authSession.cookie) {
      await fetch(`${authSession.serverUrl}/api/auth/logout`, {
        method: 'POST',
        headers: {
          Cookie: authSession.cookie
        }
      });
    }
  } catch {
    // Ignore logout network errors and clear local auth session regardless.
  }

  authSession = { serverUrl: '', cookie: '' };
  return { ok: true };
});

ipcMain.handle('open-external-url', async (event, rawUrl) => {
  try {
    const parsed = new URL(String(rawUrl || '').trim());
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { ok: false, error: 'Only http/https URLs are allowed.' };
    }

    await shell.openExternal(parsed.toString());
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : 'Could not open link.' };
  }
});
