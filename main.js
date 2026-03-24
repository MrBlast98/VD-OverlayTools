const { app, BrowserWindow, ipcMain, dialog, Menu, shell, session } = require('electron');
const path = require('path');
const fs = require('fs');
let autoUpdater = null;
let activeWindowGetter = null;
let screenshotDesktopGetter = null;
let tesseractApi = null;
let jimpApi = null;
const mapTemplateImageCache = new Map();
try {
  const { autoUpdater: au } = require('electron-updater');
  autoUpdater = au;
} catch (e) {
  console.warn('electron-updater not installed, auto-updates will be disabled');
}

const APP_ICON_PATH = (() => {
  const winIcon = path.join(__dirname, 'images', 'app-icon.ico');
  if (process.platform === 'win32') return winIcon;
  const pngFallback = path.join(__dirname, 'images', 'cover.png');
  return fs.existsSync(pngFallback) ? pngFallback : winIcon;
})();
const DEFAULT_AUTH_SERVER_URL = 'https://rings-hip-favourite-yards.trycloudflare.com';
const EXPECTED_UPDATE_OWNER = 'MrBlast98';
const EXPECTED_UPDATE_REPO = 'VD-OverlayTools';
const EXPECTED_UPDATE_PROVIDER = {
  provider: 'github',
  owner: EXPECTED_UPDATE_OWNER,
  repo: EXPECTED_UPDATE_REPO
};
const ALLOWED_UPDATE_HOSTS = new Set([
  'github.com',
  'api.github.com',
  'objects.githubusercontent.com',
  'github-releases.githubusercontent.com',
  'release-assets.githubusercontent.com'
]);
const LEGACY_AUTH_SERVER_URLS = new Set([
  'https://elderly-upload-cooperative-smaller.trycloudflare.com',
  'https://idaho-discussions-lid-generates.trycloudflare.com',
  'https://nursing-conjunction-multi-des.trycloudflare.com',
  'https://treatments-downloading-ellis-desired.trycloudflare.com'
]);
const RUNTIME_AUTH_URL_FILE = path.join(__dirname, '.runtime', 'auth-url.txt');

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
let updateCheckInterval = null;
let overlayTopmostInterval = null;
const overlayAlwaysOnTopState = new Map();

function isLocalFileUrl(rawUrl) {
  try {
    const parsed = new URL(String(rawUrl || ''));
    return parsed.protocol === 'file:';
  } catch {
    return false;
  }
}

function failClosed(reason) {
  const message = `Security policy violation: ${reason}`;
  console.error(message);
  try {
    app.exit(1);
  } finally {
    process.exit(1);
  }
}

function enforceProductionRuntimeIntegrity() {
  if (!app.isPackaged) return;

  const blockedEnv = [
    'ELECTRON_RUN_AS_NODE',
    'NODE_OPTIONS',
    'ELECTRON_ENABLE_LOGGING',
    'ELECTRON_ENABLE_STACK_DUMPING'
  ];

  for (const envKey of blockedEnv) {
    if (String(process.env[envKey] || '').trim()) {
      failClosed(`${envKey} must not be set in production`);
    }
  }

  const suspiciousArgPrefixes = ['--inspect', '--inspect-brk', '--remote-debugging-port'];
  const argv = Array.isArray(process.argv) ? process.argv.map((entry) => String(entry || '')) : [];
  if (argv.some((arg) => suspiciousArgPrefixes.some((prefix) => arg.startsWith(prefix)))) {
    failClosed('debug/instrumentation flags are blocked in production');
  }

  const appPath = String(app.getAppPath() || '').replace(/\\/g, '/').toLowerCase();
  if (!appPath.endsWith('/resources/app.asar')) {
    failClosed('application must run from app.asar in production');
  }
}

function isAllowedUpdateUrl(rawUrl) {
  const value = String(rawUrl || '').trim();
  if (!value) return false;
  if (!value.includes('://')) {
    // electron-updater may provide relative artifact names in metadata.
    return !value.includes('..') && !value.startsWith('/') && !value.startsWith('\\');
  }

  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'https:') return false;
    return ALLOWED_UPDATE_HOSTS.has(parsed.host.toLowerCase());
  } catch {
    return false;
  }
}

function isPinnedUpdateInfo(info) {
  const files = Array.isArray(info && info.files) ? info.files : [];
  if (files.length === 0) return false;
  return files.every((file) => isAllowedUpdateUrl(file && file.url ? file.url : ''));
}

function configurePinnedUpdateChannel() {
  if (!autoUpdater) return;
  autoUpdater.channel = 'latest';
  autoUpdater.setFeedURL(EXPECTED_UPDATE_PROVIDER);
}

function hardenWindowWebContents(win) {
  if (!win || win.isDestroyed()) return;

  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  win.webContents.on('will-navigate', (event, targetUrl) => {
    if (isLocalFileUrl(targetUrl)) return;
    event.preventDefault();
  });

  win.webContents.on('will-attach-webview', (event) => {
    event.preventDefault();
  });

  if (app.isPackaged) {
    win.webContents.on('before-input-event', (event, input) => {
      if (!input) return;
      const key = String(input.key || '').toLowerCase();
      const isDevToolsShortcut = key === 'f12' || ((input.control || input.meta) && input.shift && key === 'i');
      if (isDevToolsShortcut) {
        event.preventDefault();
      }
    });

    win.webContents.on('devtools-opened', () => {
      win.webContents.closeDevTools();
    });
  }
}

// Auto-updater configuration
if (autoUpdater) {
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.allowPrerelease = false;
  autoUpdater.allowDowngrade = false;
  configurePinnedUpdateChannel();

  autoUpdater.on('update-available', (info) => {
    if (!isPinnedUpdateInfo(info)) {
      console.error('Blocked update metadata from untrusted source.');
      autoUpdater.autoDownload = false;
      return;
    }
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

function scheduleUpdateChecks() {
  if (!autoUpdater) return;

  const runCheck = () => {
    autoUpdater.checkForUpdates().then((result) => {
      if (!result || !result.updateInfo) return;
      if (!isPinnedUpdateInfo(result.updateInfo)) {
        throw new Error('Update source failed pinning checks.');
      }
    }).catch((err) => {
      console.error('Scheduled update check failed:', err);
    });
  };

  // Short delay avoids noisy startup races on slower machines.
  setTimeout(runCheck, 15000);

  if (updateCheckInterval) {
    clearInterval(updateCheckInterval);
  }
  updateCheckInterval = setInterval(runCheck, 30 * 60 * 1000);
}

function normalizeServerUrl(value) {
  const defaultServer = getDefaultAuthServerUrl();
  const raw = String(value || '').trim() || defaultServer;
  const withProto = /^https?:\/\//i.test(raw) ? raw : `http://${raw}`;
  const parsed = new URL(withProto);
  const normalized = `${parsed.protocol}//${parsed.host}`;
  return LEGACY_AUTH_SERVER_URLS.has(normalized) ? defaultServer : normalized;
}

function getLockedAuthServerUrl() {
  return normalizeServerUrl(getDefaultAuthServerUrl());
}

function getDefaultAuthServerUrl() {
  const envServer = String(process.env.AUTH_SERVER_URL || '').trim();
  if (envServer) return envServer;

  try {
    const runtimeUrl = fs.readFileSync(RUNTIME_AUTH_URL_FILE, 'utf8').trim();
    if (runtimeUrl) {
      const withProto = /^https?:\/\//i.test(runtimeUrl) ? runtimeUrl : `http://${runtimeUrl}`;
      const parsed = new URL(withProto);
      return `${parsed.protocol}//${parsed.host}`;
    }
  } catch {
    // Ignore missing runtime file and fallback to static default.
  }

  return DEFAULT_AUTH_SERVER_URL;
}

function normalizeForMapMatch(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function splitCamelCaseWords(value) {
  return String(value || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildMapMatchTerms(mapName) {
  const raw = String(mapName || '').trim();
  if (!raw) return [];

  const spaced = splitCamelCaseWords(raw);
  const words = spaced.toLowerCase();
  const compact = normalizeForMapMatch(raw);
  const terms = new Set();

  if (compact) terms.add(compact);
  if (words) terms.add(words);
  if (words.includes(' ')) {
    terms.add(words.replace(/\s+/g, '-'));
    terms.add(words.replace(/\s+/g, '_'));
  }

  return Array.from(terms);
}

function scoreMapAgainstWindow(mapName, compactHaystack, lowerHaystack) {
  const terms = buildMapMatchTerms(mapName);
  if (terms.length === 0) return 0;

  let score = 0;
  for (const term of terms) {
    const isCompact = !term.includes(' ') && !term.includes('-') && !term.includes('_');
    if (isCompact) {
      if (compactHaystack.includes(term)) score += 3;
      continue;
    }

    if (lowerHaystack.includes(term)) score += 2;
  }

  return score;
}

function pickBestMapMatch(mapNames, preferredMap, sourceText) {
  const compactHaystack = normalizeForMapMatch(sourceText);
  const lowerHaystack = String(sourceText || '').toLowerCase();

  let matched = '';
  let bestScore = 0;
  for (const rawName of mapNames) {
    const mapName = String(rawName || '').trim();
    if (!mapName) continue;
    const score = scoreMapAgainstWindow(mapName, compactHaystack, lowerHaystack);
    if (score > bestScore) {
      bestScore = score;
      matched = mapName;
      continue;
    }

    // Prefer current selected map in a tie to avoid flip-flopping.
    if (score > 0 && score === bestScore && mapName === preferredMap) {
      matched = mapName;
    }
  }

  return { matched, bestScore };
}

async function getActiveWindowGetter() {
  if (activeWindowGetter) return activeWindowGetter;
  try {
    const mod = await import('active-win');
    activeWindowGetter = mod && mod.default ? mod.default : mod;
    return activeWindowGetter;
  } catch (err) {
    console.warn('active-win not available:', err && err.message ? err.message : err);
    return null;
  }
}

async function getScreenshotDesktopGetter() {
  if (screenshotDesktopGetter) return screenshotDesktopGetter;
  try {
    const mod = require('screenshot-desktop');
    screenshotDesktopGetter = mod && mod.default ? mod.default : mod;
    return screenshotDesktopGetter;
  } catch (err) {
    console.warn('screenshot-desktop not available:', err && err.message ? err.message : err);
    return null;
  }
}

async function getTesseractApi() {
  if (tesseractApi) return tesseractApi;
  try {
    tesseractApi = require('tesseract.js');
    return tesseractApi;
  } catch (err) {
    console.warn('tesseract.js not available:', err && err.message ? err.message : err);
    return null;
  }
}

async function getJimpApi() {
  if (jimpApi) return jimpApi;
  try {
    const mod = require('jimp');
    jimpApi = mod && mod.Jimp ? mod.Jimp : mod;
    return jimpApi;
  } catch (err) {
    console.warn('jimp not available:', err && err.message ? err.message : err);
    return null;
  }
}

function clamp01(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  if (num < 0) return 0;
  if (num > 1) return 1;
  return num;
}

function normalizeRoi(roi) {
  const fallback = { x: 0.3, y: 0.02, width: 0.4, height: 0.12 };
  if (!roi || typeof roi !== 'object') return fallback;
  const x = clamp01(roi.x);
  const y = clamp01(roi.y);
  const width = clamp01(roi.width);
  const height = clamp01(roi.height);

  if (width <= 0 || height <= 0) return fallback;

  return {
    x,
    y,
    width: Math.min(width, 1 - x),
    height: Math.min(height, 1 - y)
  };
}

function normalizeTemplateName(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function scoreToConfidence(score) {
  if (!Number.isFinite(score) || score <= 0) return 0;
  return clamp01(score / 5);
}

async function cropRoiBuffer(imageBuffer, roi) {
  const Jimp = await getJimpApi();
  if (!Jimp) return null;

  const image = await Jimp.read(imageBuffer);
  const imageWidth = image.bitmap && image.bitmap.width ? image.bitmap.width : 0;
  const imageHeight = image.bitmap && image.bitmap.height ? image.bitmap.height : 0;
  if (!imageWidth || !imageHeight) return null;

  const x = Math.max(0, Math.floor(roi.x * imageWidth));
  const y = Math.max(0, Math.floor(roi.y * imageHeight));
  const w = Math.max(1, Math.floor(roi.width * imageWidth));
  const h = Math.max(1, Math.floor(roi.height * imageHeight));
  const safeW = Math.min(w, imageWidth - x);
  const safeH = Math.min(h, imageHeight - y);

  const cropped = image.clone().crop({ x, y, w: safeW, h: safeH });
  return cropped.getBuffer('image/png');
}

function resolveTemplatePathForMap(mapName) {
  const dir = path.join(__dirname, 'images', 'map-templates');
  if (!fs.existsSync(dir)) return '';

  const target = normalizeTemplateName(mapName);
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const parsed = path.parse(entry.name);
    const ext = parsed.ext.toLowerCase();
    if (!['.png', '.jpg', '.jpeg', '.webp', '.bmp'].includes(ext)) continue;
    if (normalizeTemplateName(parsed.name) === target) {
      return path.join(dir, entry.name);
    }
  }

  return '';
}

async function compareRoiToTemplate(roiBuffer, templatePath) {
  const Jimp = await getJimpApi();
  if (!Jimp || !templatePath) return 0;

  let template = mapTemplateImageCache.get(templatePath);
  if (!template) {
    template = await Jimp.read(templatePath);
    mapTemplateImageCache.set(templatePath, template);
  }

  const roi = await Jimp.read(roiBuffer);
  const width = 220;
  const height = 90;
  const a = roi.clone().grayscale().resize({ w: width, h: height });
  const b = template.clone().grayscale().resize({ w: width, h: height });

  const dataA = a.bitmap.data;
  const dataB = b.bitmap.data;
  const bytes = Math.min(dataA.length, dataB.length);
  if (bytes <= 0) return 0;

  let diffTotal = 0;
  let count = 0;
  for (let i = 0; i < bytes; i += 4) {
    diffTotal += Math.abs(dataA[i] - dataB[i]);
    count += 1;
  }

  if (!count) return 0;
  const normalizedDiff = (diffTotal / count) / 255;
  return clamp01(1 - normalizedDiff);
}

async function detectByScreen(mapNames, preferredMap, roi, screenshot, tesseract) {
  const imageBuffer = await screenshot({ format: 'png' });
  const roiBuffer = await cropRoiBuffer(imageBuffer, normalizeRoi(roi));
  if (!roiBuffer) {
    return { map: '', confidence: 0, ocrConfidence: 0, templateConfidence: 0 };
  }

  const ocrResult = await tesseract.recognize(roiBuffer, 'eng');
  const ocrText = String(ocrResult && ocrResult.data && ocrResult.data.text ? ocrResult.data.text : '');
  const ocrMatch = pickBestMapMatch(mapNames, preferredMap, ocrText);
  const ocrConfidence = scoreToConfidence(ocrMatch.bestScore);

  let templateBestMap = '';
  let templateBestScore = 0;
  for (const mapName of mapNames) {
    const templatePath = resolveTemplatePathForMap(mapName);
    if (!templatePath) continue;
    const templateScore = await compareRoiToTemplate(roiBuffer, templatePath);
    if (templateScore > templateBestScore) {
      templateBestScore = templateScore;
      templateBestMap = mapName;
    }
  }

  const templateConfidence = templateBestScore;
  let chosenMap = '';
  let confidence = 0;

  if (ocrMatch.matched && templateBestMap && ocrMatch.matched === templateBestMap) {
    chosenMap = ocrMatch.matched;
    confidence = clamp01((ocrConfidence * 0.6) + (templateConfidence * 0.4) + 0.08);
  } else if (templateConfidence >= ocrConfidence) {
    chosenMap = templateBestMap;
    confidence = templateConfidence;
  } else {
    chosenMap = ocrMatch.matched;
    confidence = ocrConfidence;
  }

  return {
    map: chosenMap,
    confidence,
    ocrConfidence,
    templateConfidence
  };
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
      backgroundThrottling: false,
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      webviewTag: false,
      safeDialogs: true,
      devTools: !app.isPackaged
    }
  });
  hardenWindowWebContents(mainWindow);
  if (app.isPackaged) {
    mainWindow.setContentProtection(true);
  }
  mainWindow.webContents.setBackgroundThrottling(false);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
  mainWindow.on('enter-full-screen', () => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    mainWindow.webContents.send('window-fullscreen-changed', true);
  });
  mainWindow.on('leave-full-screen', () => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    mainWindow.webContents.send('window-fullscreen-changed', false);
  });
}

function normalizeOverlayMode(mode) {
  if (mode === '1v1') return '1v1';
  if (mode === '4v1') return '4v1';
  if (mode === 'winstreak') return 'winstreak';
  return 'map';
}

function applyOverlayTopmostState(win, enabled) {
  if (!win || win.isDestroyed()) return;
  const shouldPin = !!enabled;

  if (shouldPin) {
    // Use the highest practical level so overlays stay visible when users tab back into fullscreen games.
    win.setAlwaysOnTop(true, 'screen-saver', 1);
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    if (win.isMinimized()) {
      win.restore();
    }
    if (!win.isVisible()) {
      win.showInactive();
    }
    win.moveTop();
    return;
  }

  win.setAlwaysOnTop(false);
  win.setVisibleOnAllWorkspaces(false);
}

function ensurePinnedOverlaysVisible() {
  for (const [mode, win] of overlayWindows) {
    if (!win || win.isDestroyed()) continue;
    if (!overlayAlwaysOnTopState.get(mode)) continue;
    applyOverlayTopmostState(win, true);
  }
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
      backgroundThrottling: false,
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      webviewTag: false,
      safeDialogs: true,
      devTools: !app.isPackaged
    }
  });
  hardenWindowWebContents(win);
  if (app.isPackaged) {
    win.setContentProtection(true);
  }
  win.loadFile(path.join(__dirname, 'src', 'overlay.html'));
  // Keep every overlay discoverable so users can switch/close each one from taskbar or Alt+Tab.
  win.setSkipTaskbar(false);
  const overlayTitleByMode = {
    map: 'VD OverlayTools - Map Overlay',
    '1v1': 'VD OverlayTools - 1v1 Overlay',
    '4v1': 'VD OverlayTools - Tournament Overlay',
    winstreak: 'VD OverlayTools - Winstreak Overlay'
  };
  win.setTitle(overlayTitleByMode[overlayMode] || 'VD OverlayTools - Overlay');
  overlayAlwaysOnTopState.set(overlayMode, true);
  applyOverlayTopmostState(win, true);

  const reassert = () => {
    if (!overlayAlwaysOnTopState.get(overlayMode)) return;
    setTimeout(() => {
      applyOverlayTopmostState(win, true);
    }, 50);
  };

  win.on('show', reassert);
  win.on('restore', reassert);
  win.on('focus', reassert);
  win.on('blur', reassert);
  win.on('closed', () => {
    overlayWindows.delete(overlayMode);
    overlayAlwaysOnTopState.delete(overlayMode);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('overlay-closed', { mode: overlayMode });
    }
  });

  overlayWindows.set(overlayMode, win);
  return win;
}

enforceProductionRuntimeIntegrity();

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);

  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    callback(false);
  });

  session.defaultSession.setPermissionCheckHandler(() => false);

  createMainWindow();
  scheduleUpdateChecks();
  if (overlayTopmostInterval) {
    clearInterval(overlayTopmostInterval);
  }
  overlayTopmostInterval = setInterval(ensurePinnedOverlaysVisible, 1250);
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (overlayTopmostInterval) {
    clearInterval(overlayTopmostInterval);
    overlayTopmostInterval = null;
  }
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('open-overlay', (event, args) => {
  const mode = normalizeOverlayMode(args && args.mode ? args.mode : 'map');
  const overlayWindow = createOverlayWindow(mode);
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    overlayWindow.webContents.send('overlay-update', args);
    const alwaysOnTop = args && (args.alwaysOnTop === undefined ? true : !!args.alwaysOnTop);
    overlayAlwaysOnTopState.set(mode, alwaysOnTop);
    applyOverlayTopmostState(overlayWindow, alwaysOnTop);
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
      overlayAlwaysOnTopState.set(modeArg, !!args.alwaysOnTop);
      applyOverlayTopmostState(win, !!args.alwaysOnTop);
    }
    if (typeof args.opacity === 'number' && Number.isFinite(args.opacity)) {
      win.setOpacity(args.opacity);
    }
    return;
  }

  for (const [mode, win] of overlayWindows) {
    if (!win || win.isDestroyed()) continue;
    win.webContents.send('overlay-update', args);
    if (args.alwaysOnTop !== undefined) {
      overlayAlwaysOnTopState.set(mode, !!args.alwaysOnTop);
      applyOverlayTopmostState(win, !!args.alwaysOnTop);
    }
    if (typeof args.opacity === 'number' && Number.isFinite(args.opacity)) {
      win.setOpacity(args.opacity);
    }
  }
});

ipcMain.on('set-always-on-top', (event, val) => {
  for (const [mode, win] of overlayWindows) {
    if (win && !win.isDestroyed()) {
      overlayAlwaysOnTopState.set(mode, !!val);
      applyOverlayTopmostState(win, !!val);
    }
  }
});

ipcMain.on('window-minimize', () => {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  mainWindow.minimize();
});

ipcMain.handle('window-toggle-fullscreen', () => {
  if (!mainWindow || mainWindow.isDestroyed()) return false;
  const next = !mainWindow.isFullScreen();
  mainWindow.setFullScreen(next);
  return next;
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
    configurePinnedUpdateChannel();
    const result = await autoUpdater.checkForUpdates();
    if (!result || !result.updateInfo || !isPinnedUpdateInfo(result.updateInfo)) {
      return { ok: false, error: 'Update source validation failed.' };
    }
    return { ok: true, updateAvailable: !!result.updateInfo };
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : 'Update check failed' };
  }
});

ipcMain.handle('detect-current-map', async (event, payload) => {
  try {
    const mapNames = Array.isArray(payload && payload.mapNames) ? payload.mapNames : [];
    const preferredMap = String(payload && payload.currentMap ? payload.currentMap : '').trim();
    const method = String(payload && payload.method ? payload.method : 'screen').trim().toLowerCase();
    const roi = payload && payload.roi ? payload.roi : null;
    if (mapNames.length === 0) {
      return { ok: true, map: '', source: method };
    }

    if (method === 'screen') {
      const screenshot = await getScreenshotDesktopGetter();
      const tesseract = await getTesseractApi();
      if (!screenshot || typeof screenshot !== 'function' || !tesseract || typeof tesseract.recognize !== 'function') {
        return { ok: false, map: '', source: 'screen', error: 'Screen detector unavailable' };
      }

      const detected = await detectByScreen(mapNames, preferredMap, roi, screenshot, tesseract);

      return {
        ok: true,
        map: detected.map,
        source: 'screen',
        confidence: detected.confidence,
        ocrConfidence: detected.ocrConfidence,
        templateConfidence: detected.templateConfidence
      };
    }

    const getter = await getActiveWindowGetter();
    if (!getter || typeof getter !== 'function') {
      return { ok: false, map: '', source: 'active-window', error: 'Detector unavailable' };
    }

    const info = await getter();
    const title = String(info && info.title ? info.title : '');
    const ownerName = String(info && info.owner && info.owner.name ? info.owner.name : '');
    const ownerPath = String(info && info.owner && info.owner.path ? info.owner.path : '');
    const combined = `${title} ${ownerName} ${ownerPath}`;
    const { matched, bestScore } = pickBestMapMatch(mapNames, preferredMap, combined);

    return {
      ok: true,
      map: matched,
      source: 'active-window',
      title,
      confidence: bestScore
    };
  } catch (err) {
    return {
      ok: false,
      map: '',
      source: 'detector',
      error: err && err.message ? err.message : 'Map detection failed'
    };
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
    const clientId = envClientId;
    const clientSecret = envClientSecret;
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
    serverUrl = getLockedAuthServerUrl();
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
    serverUrl = getLockedAuthServerUrl();
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
    serverUrl = authSession.serverUrl || getLockedAuthServerUrl();
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

ipcMain.handle('theme-market-list', async (event, payload) => {
  let serverUrl = '';
  try {
    serverUrl = authSession.serverUrl || getLockedAuthServerUrl();
    if (!serverUrl || !authSession.cookie) {
      return { ok: false, error: 'Not authenticated.' };
    }

    const response = await fetch(`${serverUrl}/api/themes`, {
      headers: {
        Cookie: authSession.cookie
      }
    });

    const body = await readResponseBody(response);
    if (!response.ok) {
      return { ok: false, error: body && body.error ? body.error : `Theme fetch failed (${response.status}).` };
    }

    return {
      ok: true,
      serverUrl,
      themes: Array.isArray(body && body.themes ? body.themes : []) ? body.themes : []
    };
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : 'Theme fetch failed.' };
  }
});

ipcMain.handle('theme-market-publish', async (event, payload) => {
  let serverUrl = '';
  try {
    serverUrl = authSession.serverUrl || getLockedAuthServerUrl();
    if (!serverUrl || !authSession.cookie) {
      return { ok: false, error: 'Not authenticated.' };
    }

    const response = await fetch(`${serverUrl}/api/themes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: authSession.cookie
      },
      body: JSON.stringify({
        name: payload && payload.name ? payload.name : '',
        description: payload && payload.description ? payload.description : '',
        publishScope: payload && payload.publishScope ? payload.publishScope : {},
        payload: payload && payload.payload ? payload.payload : {},
        theme: payload && payload.theme ? payload.theme : {}
      })
    });

    const body = await readResponseBody(response);
    if (!response.ok) {
      return { ok: false, error: body && body.error ? body.error : `Theme publish failed (${response.status}).` };
    }

    return {
      ok: true,
      serverUrl,
      theme: body && body.theme ? body.theme : null
    };
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : 'Theme publish failed.' };
  }
});

ipcMain.handle('theme-market-use', async (event, payload) => {
  let serverUrl = '';
  try {
    const themeId = String(payload && payload.themeId ? payload.themeId : '').trim();
    if (!themeId) {
      return { ok: false, error: 'Theme id is required.' };
    }

    serverUrl = authSession.serverUrl || getLockedAuthServerUrl();
    if (!serverUrl || !authSession.cookie) {
      return { ok: false, error: 'Not authenticated.' };
    }

    const response = await fetch(`${serverUrl}/api/themes/${encodeURIComponent(themeId)}/use`, {
      method: 'POST',
      headers: {
        Cookie: authSession.cookie
      }
    });

    const body = await readResponseBody(response);
    if (!response.ok) {
      return { ok: false, error: body && body.error ? body.error : `Theme usage update failed (${response.status}).` };
    }

    return {
      ok: true,
      serverUrl,
      theme: body && body.theme ? body.theme : null
    };
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : 'Theme usage update failed.' };
  }
});

ipcMain.handle('theme-market-favorite', async (event, payload) => {
  let serverUrl = '';
  try {
    const themeId = String(payload && payload.themeId ? payload.themeId : '').trim();
    if (!themeId) {
      return { ok: false, error: 'Theme id is required.' };
    }

    serverUrl = authSession.serverUrl || getLockedAuthServerUrl();
    if (!serverUrl || !authSession.cookie) {
      return { ok: false, error: 'Not authenticated.' };
    }

    const response = await fetch(`${serverUrl}/api/themes/${encodeURIComponent(themeId)}/favorite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: authSession.cookie
      },
      body: JSON.stringify({
        favorited: payload && Object.prototype.hasOwnProperty.call(payload, 'favorited')
          ? !!payload.favorited
          : undefined
      })
    });

    const body = await readResponseBody(response);
    if (!response.ok) {
      return { ok: false, error: body && body.error ? body.error : `Theme favorite update failed (${response.status}).` };
    }

    return {
      ok: true,
      serverUrl,
      theme: body && body.theme ? body.theme : null
    };
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : 'Theme favorite update failed.' };
  }
});

ipcMain.handle('theme-market-update', async (event, payload) => {
  let serverUrl = '';
  try {
    const themeId = String(payload && payload.themeId ? payload.themeId : '').trim();
    if (!themeId) {
      return { ok: false, error: 'Theme id is required.' };
    }

    serverUrl = authSession.serverUrl || getLockedAuthServerUrl();
    if (!serverUrl || !authSession.cookie) {
      return { ok: false, error: 'Not authenticated.' };
    }

    const response = await fetch(`${serverUrl}/api/themes/${encodeURIComponent(themeId)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: authSession.cookie
      },
      body: JSON.stringify({
        name: payload && Object.prototype.hasOwnProperty.call(payload, 'name') ? payload.name : undefined,
        description: payload && Object.prototype.hasOwnProperty.call(payload, 'description') ? payload.description : undefined,
        publishScope: payload && Object.prototype.hasOwnProperty.call(payload, 'publishScope') ? payload.publishScope : undefined,
        payload: payload && Object.prototype.hasOwnProperty.call(payload, 'payload') ? payload.payload : undefined,
        theme: payload && Object.prototype.hasOwnProperty.call(payload, 'theme') ? payload.theme : undefined
      })
    });

    const body = await readResponseBody(response);
    if (!response.ok) {
      return { ok: false, error: body && body.error ? body.error : `Theme update failed (${response.status}).` };
    }

    return {
      ok: true,
      serverUrl,
      theme: body && body.theme ? body.theme : null
    };
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : 'Theme update failed.' };
  }
});

ipcMain.handle('theme-market-delete', async (event, payload) => {
  let serverUrl = '';
  try {
    const themeId = String(payload && payload.themeId ? payload.themeId : '').trim();
    if (!themeId) {
      return { ok: false, error: 'Theme id is required.' };
    }

    serverUrl = authSession.serverUrl || getLockedAuthServerUrl();
    if (!serverUrl || !authSession.cookie) {
      return { ok: false, error: 'Not authenticated.' };
    }

    const response = await fetch(`${serverUrl}/api/themes/${encodeURIComponent(themeId)}`, {
      method: 'DELETE',
      headers: {
        Cookie: authSession.cookie
      }
    });

    const body = await readResponseBody(response);
    if (!response.ok) {
      return { ok: false, error: body && body.error ? body.error : `Theme delete failed (${response.status}).` };
    }

    return { ok: true, serverUrl };
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : 'Theme delete failed.' };
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
