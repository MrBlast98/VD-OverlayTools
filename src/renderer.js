const SETTINGS_KEY = 'vdOverlayTools.settings.v1';
const AUTH_PREFS_KEY = 'vdOverlayTools.auth.v1';
const DEFAULT_AUTH_SERVER_URL = 'https://idaho-discussions-lid-generates.trycloudflare.com';

const mapsNA = [
  'BayHarbor',
  'BloodBath',
  'Firelink',
  'Mercy',
  'Village',
  'Woodview'
];

const mapsEU = [
  'EUMap1',
  'EUMap2',
  'EUMap3',
  'EUMap4',
  'EUMap5',
  'EUMap6'
];

const mapsOrder = mapsNA;

const FONT_OPTIONS = [
  'Segoe UI',
  'Arial',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Times New Roman',
  'Georgia',
  'Garamond',
  'Courier New',
  'Lucida Console',
  'Palatino Linotype',
  'Book Antiqua',
  'Impact',
  'Comic Sans MS',
  'Candara',
  'Calibri',
  'Cambria',
  'Consolas',
  'Constantia',
  'Corbel',
  'Franklin Gothic Medium',
  'Gill Sans MT',
  'Century Gothic',
  'Baskerville Old Face',
  'Perpetua',
  'Rockwell',
  'Copperplate Gothic',
  'MS Gothic',
  'Yu Gothic',
  'Meiryo',
  'Malgun Gothic',
  'SimSun',
  'SimHei',
  'Microsoft YaHei',
  'Nirmala UI',
  'Leelawadee UI',
  'Ebrima',
  'Bahnschrift',
  'Dubai',
  'Sitka',
  'Aptos',
  'Optima',
  'Futura',
  'Didot',
  'American Typewriter',
  'Avenir',
  'Avenir Next',
  'Helvetica',
  'Helvetica Neue',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Oswald',
  'Raleway',
  'Merriweather',
  'Nunito',
  'Rubik',
  'Inter',
  'PT Sans',
  'PT Serif',
  'Source Sans Pro',
  'Source Serif Pro',
  'Playfair Display',
  'Bebas Neue',
  'Josefin Sans',
  'Quicksand',
  'Work Sans',
  'Inconsolata',
  'Fira Sans',
  'Fira Code',
  'JetBrains Mono',
  'IBM Plex Sans',
  'IBM Plex Serif',
  'Noto Sans',
  'Noto Serif',
  'Noto Sans JP',
  'Noto Sans KR',
  'Noto Sans SC',
  'DM Sans',
  'Manrope',
  'Karla',
  'Cabin',
  'Arvo',
  'Abril Fatface',
  'Anton',
  'Barlow',
  'Exo 2',
  'Hind',
  'Mukta',
  'Teko',
  'Titillium Web',
  'Ubuntu',
  'Vollkorn',
  'Zilla Slab',
  'Libre Baskerville',
  'Space Grotesk',
  'Space Mono',
  'Caveat'
];

const defaults = {
  category: '1v1',
  region: 'NA',
  mapName: 'BayHarbor',
  mapOverlayEnabled: false,
  overlayWindow: {
    map: {
      opacity: 0.9,
      alwaysOnTop: false
    },
    onevone: {
      opacity: 0.9,
      alwaysOnTop: false
    },
    tournament: {
      opacity: 0.9,
      alwaysOnTop: false
    }
  },
  // legacy fallback fields kept for migration from older saved settings
  opacity: 0.9,
  alwaysOnTop: false,
  onevone: {
    overlayEnabled: false,
    animationsEnabled: true,
    player1Name: 'Player 1',
    player2Name: 'Player 2',
    player1NameColor: '#ffffff',
    player2NameColor: '#ffffff',
    scoreColor: '#4fc3ff',
    timerColor: '#ffffff',
    underlineColor: '#2f7dff',
    player1Score: 0,
    player2Score: 0,
    player1Seconds: 0,
    player2Seconds: 0,
    activePlayer: 'p1',
    timerRunning: false,
    startStopKey: 'F1',
    swapKey: 'F2'
  },
  tournament: {
    teamOne: 'Serenity',
    teamTwo: 'Onliners',
    bestOf: '3',
    killer: 'Veil',
    overlayEnabled: false,
    teamOneScore: 0,
    teamTwoScore: 0,
    teamOneScoreKey: 'F7',
    teamTwoScoreKey: 'F8',
    resetScoreKey: 'F9'
  },
  settings: {
    appFont: 'Segoe UI',
    customFontFiles: [],
    backgroundVisualPath: '',
    backgroundAudioPath: '',
    backgroundAudioStreamUrl: '',
    spotifyClientId: '',
    spotifyClientSecret: '',
    backgroundAudioEnabled: false,
    backgroundVolume: 0.6,
    allowVisualUpscale: false
  }
};

function deepMerge(base, incoming) {
  if (!incoming || typeof incoming !== 'object') return structuredClone(base);
  const output = structuredClone(base);
  for (const key of Object.keys(output)) {
    if (incoming[key] === undefined) continue;
    if (
      output[key] &&
      typeof output[key] === 'object' &&
      !Array.isArray(output[key]) &&
      incoming[key] &&
      typeof incoming[key] === 'object' &&
      !Array.isArray(incoming[key])
    ) {
      output[key] = deepMerge(output[key], incoming[key]);
    } else {
      output[key] = incoming[key];
    }
  }
  return output;
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return structuredClone(defaults);
    const parsed = JSON.parse(raw);
    const merged = deepMerge(defaults, parsed);

    // Backward compatibility: migrate legacy single background path to visual path.
    if (!merged.settings.backgroundVisualPath && merged.settings.backgroundPath) {
      merged.settings.backgroundVisualPath = merged.settings.backgroundPath;
    }

    // Backward compatibility: migrate legacy global overlay controls to per-mode controls.
    if (!merged.overlayWindow || typeof merged.overlayWindow !== 'object') {
      const legacyOpacity = Number.isFinite(Number(merged.opacity)) ? Number(merged.opacity) : 0.9;
      const legacyAlwaysOnTop = !!merged.alwaysOnTop;
      merged.overlayWindow = {
        map: { opacity: legacyOpacity, alwaysOnTop: legacyAlwaysOnTop },
        onevone: { opacity: legacyOpacity, alwaysOnTop: legacyAlwaysOnTop },
        tournament: { opacity: legacyOpacity, alwaysOnTop: legacyAlwaysOnTop }
      };
    }

    return merged;
  } catch {
    return structuredClone(defaults);
  }
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state));
}

const state = loadSettings();
let appBooted = false;
let authState = {
  user: null,
  serverUrl: ''
};
const FEATURE_ACCESS_ROLES = new Set(['premium', 'tester', 'dev']);

function modeToWindowKey(mode) {
  if (mode === '1v1') return 'onevone';
  if (mode === '4v1') return 'tournament';
  return 'map';
}

function getOverlayWindowConfig(mode) {
  const key = modeToWindowKey(mode);
  if (!state.overlayWindow || typeof state.overlayWindow !== 'object') {
    state.overlayWindow = structuredClone(defaults.overlayWindow);
  }
  if (!state.overlayWindow[key] || typeof state.overlayWindow[key] !== 'object') {
    state.overlayWindow[key] = structuredClone(defaults.overlayWindow[key]);
  }
  return state.overlayWindow[key];
}

function getOverlayOpacity(mode) {
  const cfg = getOverlayWindowConfig(mode);
  const value = Number(cfg.opacity);
  return Number.isFinite(value) ? value : 0.9;
}

function getOverlayAlwaysOnTop(mode) {
  return !!getOverlayWindowConfig(mode).alwaysOnTop;
}

function setOverlayOpacity(mode, value) {
  getOverlayWindowConfig(mode).opacity = Math.max(0.05, Math.min(1, Number(value) || 0.9));
}

function setOverlayAlwaysOnTop(mode, value) {
  getOverlayWindowConfig(mode).alwaysOnTop = !!value;
}

function loadAuthPrefs() {
  try {
    const raw = localStorage.getItem(AUTH_PREFS_KEY);
    if (!raw) {
      return {
        serverUrl: DEFAULT_AUTH_SERVER_URL,
        username: '',
        password: '',
        rememberMe: false
      };
    }
    const parsed = JSON.parse(raw);
    return {
      serverUrl: String(parsed.serverUrl || DEFAULT_AUTH_SERVER_URL),
      username: String(parsed.username || ''),
      password: String(parsed.password || ''),
      rememberMe: !!parsed.rememberMe
    };
  } catch {
    return {
      serverUrl: DEFAULT_AUTH_SERVER_URL,
      username: '',
      password: '',
      rememberMe: false
    };
  }
}

function saveAuthPrefs(prefs) {
  localStorage.setItem(AUTH_PREFS_KEY, JSON.stringify(prefs));
}

const overlayWorkspace = document.getElementById('overlayWorkspace');
const settingsWorkspace = document.getElementById('settingsWorkspace');

const category = document.getElementById('category');
const mapsView = document.getElementById('mapsView');
const oneVOneView = document.getElementById('oneVOneView');
const fourVOneView = document.getElementById('fourVOneView');

const regionSelect = document.getElementById('regionSelect');
const mapList = document.getElementById('mapList');
const previewImg = document.getElementById('previewImg');
const mapOverlayEnabled = document.getElementById('mapOverlayEnabled');
const closeOverlayBtn = document.getElementById('closeOverlay');
const opacity = document.getElementById('opacity');
const alwaysOnTop = document.getElementById('alwaysOnTop');

const oneVOneOverlayEnabled = document.getElementById('oneVOneOverlayEnabled');
const overlayVisibleLabel = document.getElementById('overlayVisibleLabel');
const oneVOneOpacity = document.getElementById('oneVOneOpacity');
const oneVOneAlwaysOnTop = document.getElementById('oneVOneAlwaysOnTop');
const oneVOneAnimationsEnabled = document.getElementById('oneVOneAnimationsEnabled');
const player1Name = document.getElementById('player1Name');
const player2Name = document.getElementById('player2Name');
const player1NameColor = document.getElementById('player1NameColor');
const player2NameColor = document.getElementById('player2NameColor');
const scoreColor = document.getElementById('scoreColor');
const timerColor = document.getElementById('timerColor');
const underlineColor = document.getElementById('underlineColor');
const p1Minus = document.getElementById('p1Minus');
const p1Plus = document.getElementById('p1Plus');
const p2Minus = document.getElementById('p2Minus');
const p2Plus = document.getElementById('p2Plus');
const p1Score = document.getElementById('p1Score');
const p2Score = document.getElementById('p2Score');
const timerReadout = document.getElementById('timerReadout');
const timerStartStopBtn = document.getElementById('timerStartStopBtn');
const timerResetBtn = document.getElementById('timerResetBtn');
const swapSidesBtn = document.getElementById('swapSidesBtn');

const startStopKeyBtn = document.getElementById('startStopKey');
const swapKeyBtn = document.getElementById('swapKey');
const clearStartStopKey = document.getElementById('clearStartStopKey');
const clearSwapKey = document.getElementById('clearSwapKey');

const teamOne = document.getElementById('teamOne');
const teamTwo = document.getElementById('teamTwo');
const bestOf = document.getElementById('bestOf');
const killerPick = document.getElementById('killerPick');
const tournamentOverlayEnabled = document.getElementById('tournamentOverlayEnabled');
const tournamentOpacity = document.getElementById('tournamentOpacity');
const tournamentAlwaysOnTop = document.getElementById('tournamentAlwaysOnTop');
const closeTournamentOverlay = document.getElementById('closeTournamentOverlay');
const t1Minus = document.getElementById('t1Minus');
const t1Plus = document.getElementById('t1Plus');
const t2Minus = document.getElementById('t2Minus');
const t2Plus = document.getElementById('t2Plus');
const tournamentScoreDisplay = document.getElementById('tournamentScoreDisplay');
const teamOneScoreKey = document.getElementById('teamOneScoreKey');
const teamTwoScoreKey = document.getElementById('teamTwoScoreKey');
const resetScoreKey = document.getElementById('resetScoreKey');
const clearTeamOneScoreKey = document.getElementById('clearTeamOneScoreKey');
const clearTeamTwoScoreKey = document.getElementById('clearTeamTwoScoreKey');
const clearResetScoreKey = document.getElementById('clearResetScoreKey');
const seriesPreview = document.getElementById('seriesPreview');
const matchupPreview = document.getElementById('matchupPreview');
const killerPreview = document.getElementById('killerPreview');

const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const resetSettingsBtn = document.getElementById('resetSettingsBtn');
const appFontSelect = document.getElementById('appFontSelect');
const fontPreview = document.getElementById('fontPreview');
const fontStatus = document.getElementById('fontStatus');
const customFontPath = document.getElementById('customFontPath');
const chooseCustomFontBtn = document.getElementById('chooseCustomFontBtn');
const removeCustomFontBtn = document.getElementById('removeCustomFontBtn');
const backgroundVisualPath = document.getElementById('backgroundVisualPath');
const backgroundAudioPath = document.getElementById('backgroundAudioPath');
const backgroundAudioEnabled = document.getElementById('backgroundAudioEnabled');
const backgroundVolume = document.getElementById('backgroundVolume');
const backgroundVolumeValue = document.getElementById('backgroundVolumeValue');
const chooseBackgroundVisualBtn = document.getElementById('chooseBackgroundVisualBtn');
const clearBackgroundVisualBtn = document.getElementById('clearBackgroundVisualBtn');
const chooseBackgroundAudioBtn = document.getElementById('chooseBackgroundAudioBtn');
const clearBackgroundAudioBtn = document.getElementById('clearBackgroundAudioBtn');
const allowVisualUpscale = document.getElementById('allowVisualUpscale');
const backgroundValidation = document.getElementById('backgroundValidation');
const appBackground = document.getElementById('appBackground');

const authGate = document.getElementById('authGate');
const authLoginSection = document.getElementById('authLoginSection');
const authRegisterSection = document.getElementById('authRegisterSection');
const showCreateAccountBtn = document.getElementById('showCreateAccountBtn');
const showLoginBtn = document.getElementById('showLoginBtn');
const authForm = document.getElementById('authForm');
const authServerUrl = document.getElementById('authServerUrl');
const authUsername = document.getElementById('authUsername');
const authPassword = document.getElementById('authPassword');
const authRememberMe = document.getElementById('authRememberMe');
const authLoginBtn = document.getElementById('authLoginBtn');
const authStatus = document.getElementById('authStatus');
const authRegisterForm = document.getElementById('authRegisterForm');
const authRegisterServerUrl = document.getElementById('authRegisterServerUrl');
const authRegisterInviteCode = document.getElementById('authRegisterInviteCode');
const authRegisterEmail = document.getElementById('authRegisterEmail');
const authRegisterUsername = document.getElementById('authRegisterUsername');
const authRegisterPassword = document.getElementById('authRegisterPassword');
const authRegisterConfirmPassword = document.getElementById('authRegisterConfirmPassword');
const authRegisterBtn = document.getElementById('authRegisterBtn');
const authRegisterStatus = document.getElementById('authRegisterStatus');
const appContainer = document.getElementById('appContainer');
const accountLabel = document.getElementById('accountLabel');
const accountRole = document.getElementById('accountRole');
const authLogoutBtn = document.getElementById('authLogoutBtn');
const premiumUpsell = document.getElementById('premiumUpsell');
const buyPremiumBtn = document.getElementById('buyPremiumBtn');
const sponsorVdlBtn = document.getElementById('sponsorVdlBtn');
const featureLockNotice = document.getElementById('featureLockNotice');

const DISCORD_BUY_URL = 'https://discord.gg/EMsvghEefN';
const DISCORD_SPONSOR_URL = 'https://discord.gg/5Vw2P8xP4g';

const oneVOneCustomizationControls = [
  player1NameColor,
  player2NameColor,
  timerColor,
  underlineColor,
  scoreColor
].filter(Boolean);

const visualBackgroundControls = [
  chooseBackgroundVisualBtn,
  clearBackgroundVisualBtn,
  allowVisualUpscale
].filter(Boolean);

const musicSearchInput = document.getElementById('musicSearchInput');
const musicSearchBtn = document.getElementById('musicSearchBtn');
const musicSearchResults = document.getElementById('musicSearchResults');
const musicResultsList = document.getElementById('musicResultsList');
const musicSelection = document.getElementById('musicSelection');
const selectedSongTitle = document.getElementById('selectedSongTitle');
const selectedSongArtist = document.getElementById('selectedSongArtist');
const loadMusicVideoBtn = document.getElementById('loadMusicVideoBtn');
const playSongOnlyBtn = document.getElementById('playSongOnlyBtn');
const clearMusicBtn = document.getElementById('clearMusicBtn');
const videoSearchResults = document.getElementById('videoSearchResults');
const videoResultsList = document.getElementById('videoResultsList');
const musicLoadStatus = document.getElementById('musicLoadStatus');
const musicValidation = document.getElementById('musicValidation');
const appMinimizeBtn = document.getElementById('appMinimizeBtn');
const appCloseBtn = document.getElementById('appCloseBtn');

let captureTarget = null;
let timerInterval = null;
const loadedWebFonts = new Set();
const loadedCustomFontFaces = new Set();
let currentSelectedSong = null;

function isWebUrl(value) {
  return /^https?:\/\//i.test((value || '').trim());
}

function mediaSource(value) {
  if (!value) return '';
  if (isWebUrl(value)) return value;
  return toFileUrl(value);
}

async function searchSongs(query) {
  const result = await window.api.spotifySearchTracks({
    query,
    limit: 15
  });

  if (!result || !result.ok) {
    throw new Error(result && result.error ? result.error : 'Song lookup failed.');
  }

  return Array.isArray(result.tracks) ? result.tracks : [];
}

function formatDurationMs(durationMs) {
  const total = Math.max(0, Math.floor((Number(durationMs) || 0) / 1000));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

async function searchYouTube(songTitle, artistName) {
  try {
    const query = `${songTitle} ${artistName} official music video`;
    // YouTube search via public interface is blocked, so we'll provide direct link format
    // User will need to click and verify the video themselves
    return generateYouTubeSearchLink(query);
  } catch {
    return null;
  }
}

function generateYouTubeSearchLink(query) {
  return {
    title: 'Official Music Video',
    artist: 'YouTube',
    searchQuery: query,
    link: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
  };
}

function formatTimer(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.max(0, totalSeconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function toFileUrl(filePath) {
  return encodeURI(`file:///${filePath.replace(/\\/g, '/')}`);
}

function isWindowsAbsolutePath(filePath) {
  return /^[a-zA-Z]:\\/.test(filePath || '');
}

function isUncPath(filePath) {
  return /^\\\\/.test(filePath || '');
}

function mediaFileUrl(filePath) {
  if (!filePath) return '';
  if (isWebUrl(filePath)) return filePath;

  if (isWindowsAbsolutePath(filePath) || isUncPath(filePath)) {
    return toFileUrl(filePath);
  }

  try {
    return encodeURI(new URL(filePath, window.location.href).href);
  } catch {
    return toFileUrl(filePath);
  }
}

function mediaKind(filePath) {
  const lower = (filePath || '').toLowerCase();
  if (!lower) return 'none';
  if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.ogg')) return 'video';
  if (lower.endsWith('.mp3') || lower.endsWith('.wav')) return 'audio';
  return 'image';
}

function audioKind(filePath) {
  const lower = (filePath || '').toLowerCase();
  if (!lower) return 'none';
  if (lower.endsWith('.mp3') || lower.endsWith('.wav') || lower.endsWith('.ogg')) return 'audio';
  return 'other';
}

function fileExt(filePath) {
  const lower = (filePath || '').toLowerCase();
  const dot = lower.lastIndexOf('.');
  if (dot < 0) return '';
  return lower.slice(dot + 1);
}

function parseResolutionTier(width, height) {
  if (width === 1920 && height === 1080) return '1080p';
  if (width === 3840 && height === 2160) return '4K';
  return null;
}

function readImageDimensions(filePath) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      reject(new Error('Could not read image dimensions.'));
    };
    img.src = mediaFileUrl(filePath);
  });
}

function readVideoDimensions(filePath) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      resolve({ width: video.videoWidth, height: video.videoHeight });
      video.src = '';
    };
    video.onerror = () => {
      reject(new Error('Could not read video dimensions.'));
      video.src = '';
    };
    video.src = mediaFileUrl(filePath);
  });
}

async function validateVisualResolution(filePath) {
  const kind = mediaKind(filePath);
  if (kind !== 'image' && kind !== 'video') {
    return {
      ok: false,
      message: 'Visual must be an image or video file.',
      width: 0,
      height: 0,
      tier: null
    };
  }

  try {
    const dimensions = kind === 'image'
      ? await readImageDimensions(filePath)
      : await readVideoDimensions(filePath);

    const tier = parseResolutionTier(dimensions.width, dimensions.height);
    if (!tier) {
      return {
        ok: false,
        message: `Visual must be 1920x1080 (1080p) or 3840x2160 (4K). Selected ${dimensions.width}x${dimensions.height}.`,
        width: dimensions.width,
        height: dimensions.height,
        tier: null
      };
    }

    return {
      ok: true,
      message: `Visual quality verified at ${tier} (${dimensions.width}x${dimensions.height}).`,
      width: dimensions.width,
      height: dimensions.height,
      tier
    };
  } catch {
    return {
      ok: false,
      message: 'Could not inspect visual resolution. Try a different file.',
      width: 0,
      height: 0,
      tier: null
    };
  }
}

function isValidVisualFile(filePath) {
  const ext = fileExt(filePath);
  return ['png', 'jpg', 'jpeg', 'webp', 'gif', 'mp4', 'webm', 'ogg'].includes(ext);
}

function isValidAudioFile(filePath) {
  const ext = fileExt(filePath);
  return ['mp3', 'wav', 'ogg'].includes(ext);
}

function setBackgroundValidation(message, type) {
  if (!message) {
    backgroundValidation.textContent = '';
    backgroundValidation.classList.add('hidden');
    backgroundValidation.classList.remove('error', 'success', 'warning');
    return;
  }

  backgroundValidation.textContent = message;
  backgroundValidation.classList.remove('hidden', 'error', 'success', 'warning');
  if (type) backgroundValidation.classList.add(type);
}

function setFontStatus(message, type) {
  if (!message) {
    fontStatus.textContent = '';
    fontStatus.classList.add('hidden');
    fontStatus.classList.remove('error', 'success');
    return;
  }
  fontStatus.textContent = message;
  fontStatus.classList.remove('hidden', 'error', 'success');
  if (type) fontStatus.classList.add(type);
}

function normalizeCustomFontList(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => ({
      name: String(entry && entry.name ? entry.name : '').trim(),
      path: String(entry && entry.path ? entry.path : '').trim()
    }))
    .filter((entry) => entry.name && entry.path);
}

function getCustomFontList() {
  return normalizeCustomFontList(state.settings.customFontFiles);
}

function findCustomFontEntry(fontName) {
  const selected = String(fontName || '').trim();
  if (!selected) return null;
  return getCustomFontList().find((entry) => entry.name === selected) || null;
}

function fileNameWithoutExt(filePath) {
  const normalized = String(filePath || '').replace(/\\/g, '/');
  const base = normalized.split('/').pop() || '';
  return base.replace(/\.[^.]+$/, '').trim() || 'Custom Font';
}

function isValidCustomFontFile(filePath) {
  const ext = fileExt(filePath);
  return ['ttf', 'otf', 'woff', 'woff2'].includes(ext);
}

function buildUniqueCustomFontName(filePath, existingFonts) {
  const base = fileNameWithoutExt(filePath);
  let candidate = `Custom ${base}`;
  let i = 2;

  while ((existingFonts || []).some((entry) => entry.name === candidate && entry.path !== filePath)) {
    candidate = `Custom ${base} ${i}`;
    i += 1;
  }

  return candidate;
}

function setAuthStatus(message, type) {
  if (!message) {
    authStatus.textContent = '';
    authStatus.classList.add('hidden');
    authStatus.classList.remove('error', 'success', 'warning');
    return;
  }

  authStatus.textContent = message;
  authStatus.classList.remove('hidden', 'error', 'success', 'warning');
  if (type) authStatus.classList.add(type);
}

function setAuthRegisterStatus(message, type) {
  if (!message) {
    authRegisterStatus.textContent = '';
    authRegisterStatus.classList.add('hidden');
    authRegisterStatus.classList.remove('error', 'success', 'warning');
    return;
  }

  authRegisterStatus.textContent = message;
  authRegisterStatus.classList.remove('hidden', 'error', 'success', 'warning');
  if (type) authRegisterStatus.classList.add(type);
}

function setAuthMode(mode) {
  const registerMode = mode === 'register';
  if (authLoginSection) authLoginSection.classList.toggle('hidden', registerMode);
  if (authRegisterSection) authRegisterSection.classList.toggle('hidden', !registerMode);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function roleLabel(role) {
  const value = String(role || 'user').toLowerCase();
  if (value === 'premium') return 'Premium';
  if (value === 'tester') return 'Tester';
  if (value === 'dev') return 'Dev';
  return 'User';
}

function hasFeatureAccess() {
  const role = String(authState && authState.user && authState.user.role ? authState.user.role : 'user').toLowerCase();
  return FEATURE_ACCESS_ROLES.has(role);
}

function shouldShowPremiumUpsell() {
  const role = String(authState && authState.user && authState.user.role ? authState.user.role : 'user').toLowerCase();
  return role === 'user';
}

function setWorkspaceLocked(workspaceEl, locked) {
  if (!workspaceEl) return;

  workspaceEl.classList.toggle('locked-view', locked);
  const controls = workspaceEl.querySelectorAll('input, select, textarea, button');
  controls.forEach((control) => {
    control.disabled = locked;
  });
}

function setControlsLocked(controls, locked) {
  (controls || []).forEach((control) => {
    control.disabled = locked;
  });
}

function applyFeatureAccessUI() {
  const isAuthed = !!(authState.user && authState.user.username);
  const locked = isAuthed && !hasFeatureAccess();
  const oneVOneCustomizationLocked = isAuthed && !hasFeatureAccess();
  const visualBackgroundLocked = isAuthed && !hasFeatureAccess();

  if (featureLockNotice) {
    const show4v1Lock = locked && state.category === '4v1';
    const showOneVOneCustomizationLock = oneVOneCustomizationLocked && state.category === '1v1';
    const showVisualBackgroundLock = visualBackgroundLocked && state.category === 'settings';
    featureLockNotice.classList.toggle('hidden', !(show4v1Lock || showOneVOneCustomizationLock || showVisualBackgroundLock));
    if (show4v1Lock) {
      featureLockNotice.innerHTML = '<strong>4v1 Locked:</strong> This tab is only available to <strong>Premium</strong>, <strong>Tester</strong>, or <strong>Dev</strong> accounts.';
    } else if (showOneVOneCustomizationLock) {
      featureLockNotice.innerHTML = '<strong>Customization Locked:</strong> Only <strong>Player 1</strong> and <strong>Player 2</strong> names are editable on user-tier accounts. Color/style customization is for <strong>Premium</strong>, <strong>Tester</strong>, and <strong>Dev</strong>.';
    } else if (showVisualBackgroundLock) {
      featureLockNotice.innerHTML = '<strong>Background Visual Locked:</strong> Changing overlay visuals (images/videos) is available to <strong>Premium</strong>, <strong>Tester</strong>, and <strong>Dev</strong> accounts.';
    }
  }

  setWorkspaceLocked(fourVOneView, locked);
  setControlsLocked(oneVOneCustomizationControls, oneVOneCustomizationLocked);
  setControlsLocked(visualBackgroundControls, visualBackgroundLocked);

  if (locked && state.tournament.overlayEnabled) {
    state.tournament.overlayEnabled = false;
    applyTournamentUI();
    saveSettings();
    void window.api.closeOverlay();
  }
}

function applyAuthUI() {
  const isAuthed = !!(authState.user && authState.user.username);
  authGate.classList.toggle('hidden', isAuthed);
  appContainer.classList.toggle('hidden', !isAuthed);

  if (isAuthed) {
    accountLabel.textContent = `@${authState.user.username}`;
    accountRole.textContent = `role: ${roleLabel(authState.user.role)}`;
  } else {
    accountLabel.textContent = 'Not logged in';
    accountRole.textContent = 'role: user';
  }

  if (premiumUpsell) {
    premiumUpsell.classList.toggle('hidden', !(isAuthed && shouldShowPremiumUpsell()));
  }

  applyFeatureAccessUI();
}

async function ensureBooted() {
  if (appBooted) {
    applyFeatureAccessUI();
    return;
  }

  bootUI();
  if (!hasFeatureAccess() && state.tournament.overlayEnabled) {
    state.tournament.overlayEnabled = false;
    saveSettings();
  }
  await bootOverlayState();
  appBooted = true;
  applyFeatureAccessUI();
}

async function loginWithServer() {
  const serverUrl = (authState.serverUrl || DEFAULT_AUTH_SERVER_URL).trim();
  const username = authUsername.value.trim();
  const password = authPassword.value;
  const rememberMe = !!(authRememberMe && authRememberMe.checked);

  if (!username || !password) {
    setAuthStatus('Enter username and password.', 'error');
    return;
  }

  authLoginBtn.disabled = true;
  authLoginBtn.textContent = 'Logging in...';
  setAuthStatus('', '');

  try {
    const result = await window.api.authLogin({
      serverUrl,
      username,
      password
    });

    if (!result || !result.ok || !result.user) {
      setAuthStatus(result && result.error ? result.error : 'Login failed.', 'error');
      return;
    }

    authState = {
      user: result.user,
      serverUrl: result.serverUrl || ''
    };
    if (rememberMe) {
      saveAuthPrefs({
        serverUrl,
        username,
        password,
        rememberMe: true
      });
    } else {
      saveAuthPrefs({
        serverUrl,
        username: '',
        password: '',
        rememberMe: false
      });
    }

    authPassword.value = '';
    applyAuthUI();
    await ensureBooted();
  } catch (err) {
    setAuthStatus(err && err.message ? err.message : 'Login failed.', 'error');
  } finally {
    authLoginBtn.disabled = false;
    authLoginBtn.textContent = 'Login';
  }
}

async function registerWithServer() {
  const serverUrl = (authState.serverUrl || DEFAULT_AUTH_SERVER_URL).trim();
  const inviteCode = authRegisterInviteCode.value.trim();
  const email = authRegisterEmail.value.trim();
  const username = authRegisterUsername.value.trim();
  const password = authRegisterPassword.value;
  const confirmPassword = authRegisterConfirmPassword.value;

  if (!inviteCode || !email || !username || !password || !confirmPassword) {
    setAuthRegisterStatus('Enter invite code, email, username, password, and confirm password.', 'error');
    return;
  }
  if (!isValidEmail(email)) {
    setAuthRegisterStatus('Enter a valid email address.', 'error');
    return;
  }
  if (password !== confirmPassword) {
    setAuthRegisterStatus('Passwords do not match.', 'error');
    return;
  }

  authRegisterBtn.disabled = true;
  authRegisterBtn.textContent = 'Creating...';
  setAuthRegisterStatus('', '');

  try {
    const result = await window.api.authRegister({ serverUrl, inviteCode, email, username, password });
    if (!result || !result.ok) {
      setAuthRegisterStatus(result && result.error ? result.error : 'Create account failed.', 'error');
      return;
    }

    authUsername.value = username;
    authPassword.value = '';
    authRegisterInviteCode.value = '';
    authRegisterPassword.value = '';
    authRegisterConfirmPassword.value = '';
    setAuthRegisterStatus(result.message || 'Account created. You can log in now.', 'success');
    setAuthMode('login');
    setAuthStatus('Account created. Log in with your new username and password.', 'success');
  } catch (err) {
    setAuthRegisterStatus(err && err.message ? err.message : 'Create account failed.', 'error');
  } finally {
    authRegisterBtn.disabled = false;
    authRegisterBtn.textContent = 'Create Account';
  }
}

async function restoreSession() {
  // Check for available updates
  try {
    const updateResult = await window.api.checkUpdates();
    if (updateResult && updateResult.ok && updateResult.updateAvailable) {
      console.log('Update is available');
    }
  } catch (err) {
    console.log('Update check skipped');
  }

  const prefs = loadAuthPrefs();
  authState.serverUrl = String(prefs.serverUrl || DEFAULT_AUTH_SERVER_URL).trim();
  authUsername.value = prefs.username || '';
  authPassword.value = prefs.rememberMe ? (prefs.password || '') : '';
  if (authRememberMe) authRememberMe.checked = !!prefs.rememberMe;

  try {
    const result = await window.api.authMe({ serverUrl: authState.serverUrl || DEFAULT_AUTH_SERVER_URL });
    if (result && result.ok && result.user) {
      authState = {
        user: result.user,
        serverUrl: result.serverUrl || ''
      };
      applyAuthUI();
      await ensureBooted();
      return;
    }
  } catch {
    // Ignore and show login form.
  }

  if (prefs.rememberMe && prefs.username && prefs.password) {
    await loginWithServer();
    if (authState.user) return;
  }

  applyAuthUI();
}

function webFontHref(font) {
  const family = encodeURIComponent(font).replace(/%20/g, '+');
  return `https://fonts.googleapis.com/css2?family=${family}:wght@400;600;700;800&display=swap`;
}

async function ensureFontAvailable(font) {
  const cssDescriptor = `16px "${font}"`;
  if (document.fonts && document.fonts.check(cssDescriptor)) return true;

  const customEntry = findCustomFontEntry(font);
  if (customEntry) {
    try {
      if (!loadedCustomFontFaces.has(font)) {
        const fontFace = new FontFace(font, `url("${toFileUrl(customEntry.path)}")`);
        await fontFace.load();
        if (document.fonts && document.fonts.add) {
          document.fonts.add(fontFace);
        }
        loadedCustomFontFaces.add(font);
      }

      return document.fonts ? document.fonts.check(cssDescriptor) : true;
    } catch {
      return false;
    }
  }

  if (!loadedWebFonts.has(font)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = webFontHref(font);
    document.head.appendChild(link);
    loadedWebFonts.add(font);
  }

  try {
    if (document.fonts && document.fonts.load) {
      await document.fonts.load(cssDescriptor);
    }
  } catch {
    // fallback check below
  }

  return document.fonts ? document.fonts.check(cssDescriptor) : true;
}

function applyBackgroundMedia() {
  const visualPath = state.settings.backgroundVisualPath;
  const visualKind = mediaKind(visualPath);
  const audioPath = state.settings.backgroundAudioPath;
  const audioStreamUrl = state.settings.backgroundAudioStreamUrl || '';
  const activeAudioSource = audioStreamUrl || audioPath;
  const audioTrackKind = activeAudioSource
    ? (isWebUrl(activeAudioSource) ? 'audio' : audioKind(activeAudioSource))
    : 'none';
  const allowAudio = !!state.settings.backgroundAudioEnabled;
  const volume = Math.max(0, Math.min(1, Number(state.settings.backgroundVolume) || 0));
  appBackground.style.backgroundImage = 'none';
  appBackground.innerHTML = '';

  if (visualPath && visualKind === 'image') {
    const visualUrl = mediaFileUrl(visualPath);
    const image = document.createElement('img');
    image.src = visualUrl;
    image.alt = '';
    image.decoding = 'async';
    appBackground.appendChild(image);
  }

  if (visualPath && visualKind === 'video') {
    const visualUrl = mediaFileUrl(visualPath);
    const video = document.createElement('video');
    video.src = visualUrl;
    video.autoplay = true;
    video.loop = true;
    video.muted = !allowAudio || !!activeAudioSource;
    video.volume = volume;
    video.playsInline = true;
    video.controls = false;
    appBackground.appendChild(video);
    video.play().catch(() => {});
  }

  if (activeAudioSource && audioTrackKind === 'audio') {
    const audioUrl = mediaSource(activeAudioSource);
    const audio = document.createElement('audio');
    audio.src = audioUrl;
    audio.autoplay = true;
    audio.loop = true;
    audio.muted = !allowAudio;
    audio.volume = volume;
    audio.controls = false;
    appBackground.appendChild(audio);
    audio.play().catch(() => {});
  }
}

function applyBackgroundPlaybackSettings() {
  const audioPath = state.settings.backgroundAudioPath;
  const audioStreamUrl = state.settings.backgroundAudioStreamUrl || '';
  const activeAudioSource = audioStreamUrl || audioPath;
  const allowAudio = !!state.settings.backgroundAudioEnabled;
  const volume = Math.max(0, Math.min(1, Number(state.settings.backgroundVolume) || 0));

  const visualVideo = appBackground.querySelector('video');
  if (visualVideo) {
    visualVideo.muted = !allowAudio || !!activeAudioSource;
    visualVideo.volume = volume;
  }

  const audioTrack = appBackground.querySelector('audio');
  if (audioTrack) {
    audioTrack.muted = !allowAudio;
    audioTrack.volume = volume;
  }
}

function applyCategoryView() {
  const value = state.category;
  category.value = value;
  const showSettings = value === 'settings';
  overlayWorkspace.classList.toggle('hidden', showSettings);
  settingsWorkspace.classList.toggle('hidden', !showSettings);
  mapsView.classList.toggle('hidden', value !== 'maps');
  oneVOneView.classList.toggle('hidden', value !== '1v1');
  fourVOneView.classList.toggle('hidden', value !== '4v1');
}

function populateFontOptions() {
  appFontSelect.innerHTML = '';
  FONT_OPTIONS.forEach((font) => {
    const opt = document.createElement('option');
    opt.value = font;
    opt.textContent = font;
    appFontSelect.appendChild(opt);
  });

  const customFonts = getCustomFontList();
  if (customFonts.length > 0) {
    customFonts.forEach((entry) => {
      const opt = document.createElement('option');
      opt.value = entry.name;
      opt.textContent = `${entry.name} (Custom)`;
      appFontSelect.appendChild(opt);
    });
  }

  const selectedFont = state.settings.appFont || 'Segoe UI';
  const hasSelected = Array.from(appFontSelect.options).some((opt) => opt.value === selectedFont);
  if (!hasSelected) {
    const fallback = document.createElement('option');
    fallback.value = selectedFont;
    fallback.textContent = selectedFont;
    appFontSelect.appendChild(fallback);
  }
}

function applyAppFont() {
  const selectedFont = state.settings.appFont || 'Segoe UI';
  const fontStack = `"${selectedFont}", "Segoe UI", Arial, sans-serif`;
  document.body.style.fontFamily = fontStack;
  fontPreview.style.fontFamily = fontStack;
  fontPreview.textContent = `The quick brown fox jumps over the lazy dog 0123456789`;
}

async function applySelectedFontWithValidation() {
  const selectedFont = state.settings.appFont || 'Segoe UI';
  applyAppFont();
  const ok = await ensureFontAvailable(selectedFont);
  if (ok) {
    setFontStatus(`Font applied: ${selectedFont}`, 'success');
  } else {
    setFontStatus(`Font '${selectedFont}' is unavailable here. Fallback font is being used.`, 'error');
  }
}

function populateMaps(region = 'NA') {
  mapList.innerHTML = '';
  const maps = region === 'EU' ? mapsEU : mapsNA;
  maps.forEach((name) => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    mapList.appendChild(opt);
  });
}

function updateMapPreview() {
  const path = `../images/${state.mapName}.png`;
  previewImg.src = path;
  previewImg.onerror = () => {
    previewImg.alt = 'Add map image in images/ folder, for example BayHarbor.png';
  };
}

function formatKey(ev) {
  if (!ev || !ev.key) return '-';
  const key = ev.key;
  if (key === ' ') return 'Space';
  if (key.length === 1) return key.toUpperCase();
  return key;
}

function updateTournamentPreview() {
  const left = (state.tournament.teamOne || '').trim() || 'Team 1';
  const right = (state.tournament.teamTwo || '').trim() || 'Team 2';
  const scoreMid = `${state.tournament.teamOneScore}-${state.tournament.teamTwoScore}`;
  seriesPreview.textContent = `Best of ${state.tournament.bestOf}`;
  matchupPreview.textContent = `${left} ${scoreMid} ${right}`;
  killerPreview.textContent = `Killer: ${state.tournament.killer}`;
  tournamentScoreDisplay.textContent = scoreMid;
}

function sendTournamentOverlayUpdate() {
  window.api.updateOverlay({
    mode: '4v1',
    alwaysOnTop: getOverlayAlwaysOnTop('4v1'),
    fontFamily: state.settings.appFont,
    tournament: {
      teamOne: state.tournament.teamOne,
      teamTwo: state.tournament.teamTwo,
      teamOneScore: state.tournament.teamOneScore,
      teamTwoScore: state.tournament.teamTwoScore,
      bestOf: state.tournament.bestOf,
      killer: state.tournament.killer
    }
  });
}

async function openTournamentOverlayIfEnabled() {
  if (!state.tournament.overlayEnabled || !hasFeatureAccess()) return;
  await window.api.openOverlay({
    mode: '4v1',
    opacity: getOverlayOpacity('4v1'),
    alwaysOnTop: getOverlayAlwaysOnTop('4v1'),
    fontFamily: state.settings.appFont,
    tournament: {
      teamOne: state.tournament.teamOne,
      teamTwo: state.tournament.teamTwo,
      teamOneScore: state.tournament.teamOneScore,
      teamTwoScore: state.tournament.teamTwoScore,
      bestOf: state.tournament.bestOf,
      killer: state.tournament.killer
    }
  });
}

function applyTimerUI() {
  const p1Time = formatTimer(state.onevone.player1Seconds);
  const p2Time = formatTimer(state.onevone.player2Seconds);
  const scoreText = `${state.onevone.player1Score}-${state.onevone.player2Score}`;
  const activeTag = state.onevone.activePlayer === 'p1' ? 'P1 live' : 'P2 live';
  timerReadout.textContent = `${state.onevone.player1Name} (${p1Time}) ${scoreText} ${state.onevone.player2Name} (${p2Time}) - ${activeTag}`;
  timerReadout.style.color = state.onevone.timerColor;
  p1Score.textContent = String(state.onevone.player1Score);
  p2Score.textContent = String(state.onevone.player2Score);
  p1Score.style.color = state.onevone.scoreColor;
  p2Score.style.color = state.onevone.scoreColor;
  timerStartStopBtn.textContent = state.onevone.timerRunning ? 'Stop' : 'Start';
}

function applyOneVOneUI() {
  oneVOneOverlayEnabled.checked = !!state.onevone.overlayEnabled;
  overlayVisibleLabel.textContent = state.onevone.overlayEnabled ? 'Overlay On' : 'Overlay Off';
  if (oneVOneOpacity) oneVOneOpacity.value = String(getOverlayOpacity('1v1'));
  if (oneVOneAlwaysOnTop) oneVOneAlwaysOnTop.checked = getOverlayAlwaysOnTop('1v1');
  if (oneVOneAnimationsEnabled) oneVOneAnimationsEnabled.checked = state.onevone.animationsEnabled !== false;

  player1Name.value = state.onevone.player1Name;
  player2Name.value = state.onevone.player2Name;
  player1NameColor.value = state.onevone.player1NameColor;
  player2NameColor.value = state.onevone.player2NameColor;
  scoreColor.value = state.onevone.scoreColor;
  timerColor.value = state.onevone.timerColor;
  underlineColor.value = state.onevone.underlineColor;

  startStopKeyBtn.textContent = state.onevone.startStopKey;
  swapKeyBtn.textContent = state.onevone.swapKey;
  applyTimerUI();
}

function applyMapsUI() {
  mapList.value = state.mapName;
  mapOverlayEnabled.checked = !!state.mapOverlayEnabled;
  opacity.value = String(getOverlayOpacity('map'));
  alwaysOnTop.checked = getOverlayAlwaysOnTop('map');
  updateMapPreview();
}

function syncOverlayWindowControlViews() {
  if (opacity) opacity.value = String(getOverlayOpacity('map'));
  if (alwaysOnTop) alwaysOnTop.checked = getOverlayAlwaysOnTop('map');
  if (oneVOneOpacity) oneVOneOpacity.value = String(getOverlayOpacity('1v1'));
  if (oneVOneAlwaysOnTop) oneVOneAlwaysOnTop.checked = getOverlayAlwaysOnTop('1v1');
  if (tournamentOpacity) tournamentOpacity.value = String(getOverlayOpacity('4v1'));
  if (tournamentAlwaysOnTop) tournamentAlwaysOnTop.checked = getOverlayAlwaysOnTop('4v1');
}

function applyTournamentUI() {
  teamOne.value = state.tournament.teamOne;
  teamTwo.value = state.tournament.teamTwo;
  bestOf.value = state.tournament.bestOf;
  killerPick.value = state.tournament.killer;
  tournamentOverlayEnabled.checked = !!state.tournament.overlayEnabled;
  if (tournamentOpacity) tournamentOpacity.value = String(getOverlayOpacity('4v1'));
  if (tournamentAlwaysOnTop) tournamentAlwaysOnTop.checked = getOverlayAlwaysOnTop('4v1');
  teamOneScoreKey.textContent = state.tournament.teamOneScoreKey;
  teamTwoScoreKey.textContent = state.tournament.teamTwoScoreKey;
  resetScoreKey.textContent = state.tournament.resetScoreKey;
  updateTournamentPreview();
}

function applySettingsUI() {
  appFontSelect.value = state.settings.appFont || 'Segoe UI';
  const selectedCustomFont = findCustomFontEntry(state.settings.appFont || '');
  customFontPath.value = selectedCustomFont ? selectedCustomFont.path : '';
  if (removeCustomFontBtn) {
    removeCustomFontBtn.disabled = !selectedCustomFont;
  }
  backgroundVisualPath.value = state.settings.backgroundVisualPath || '';
  backgroundAudioPath.value = state.settings.backgroundAudioStreamUrl || state.settings.backgroundAudioPath || '';
  backgroundAudioEnabled.checked = !!state.settings.backgroundAudioEnabled;
  allowVisualUpscale.checked = !!state.settings.allowVisualUpscale;
  backgroundVolume.value = String(Math.round((Number(state.settings.backgroundVolume) || 0) * 100));
  backgroundVolumeValue.textContent = `${backgroundVolume.value}%`;

  const warnings = [];
  if (state.settings.backgroundVisualPath && !isValidVisualFile(state.settings.backgroundVisualPath)) {
    warnings.push('Visual file type is invalid. Use png/jpg/jpeg/webp/gif/mp4/webm/ogg.');
  }
  if (state.settings.backgroundAudioPath && !state.settings.backgroundAudioStreamUrl && !isValidAudioFile(state.settings.backgroundAudioPath)) {
    warnings.push('Audio file type is invalid. Use mp3/wav/ogg.');
  }

  if (warnings.length > 0) {
    setBackgroundValidation(warnings.join(' '), 'error');
  }

  void applySelectedFontWithValidation();
  applyBackgroundMedia();
}

function sendOneVOneOverlayUpdate() {
  window.api.updateOverlay({
    mode: '1v1',
    alwaysOnTop: getOverlayAlwaysOnTop('1v1'),
    fontFamily: state.settings.appFont,
    onevone: {
      animationsEnabled: state.onevone.animationsEnabled !== false,
      player1Name: state.onevone.player1Name,
      player2Name: state.onevone.player2Name,
      player1NameColor: state.onevone.player1NameColor,
      player2NameColor: state.onevone.player2NameColor,
      scoreColor: state.onevone.scoreColor,
      timerColor: state.onevone.timerColor,
      underlineColor: state.onevone.underlineColor,
      player1Score: state.onevone.player1Score,
      player2Score: state.onevone.player2Score,
      player1TimeText: formatTimer(state.onevone.player1Seconds),
      player2TimeText: formatTimer(state.onevone.player2Seconds)
    }
  });
}

async function openOneVOneOverlayIfEnabled() {
  if (!state.onevone.overlayEnabled) return;
  await window.api.openOverlay({
    mode: '1v1',
    opacity: getOverlayOpacity('1v1'),
    alwaysOnTop: getOverlayAlwaysOnTop('1v1'),
    fontFamily: state.settings.appFont,
    onevone: {
      animationsEnabled: state.onevone.animationsEnabled !== false,
      player1Name: state.onevone.player1Name,
      player2Name: state.onevone.player2Name,
      player1NameColor: state.onevone.player1NameColor,
      player2NameColor: state.onevone.player2NameColor,
      scoreColor: state.onevone.scoreColor,
      timerColor: state.onevone.timerColor,
      underlineColor: state.onevone.underlineColor,
      player1Score: state.onevone.player1Score,
      player2Score: state.onevone.player2Score,
      player1TimeText: formatTimer(state.onevone.player1Seconds),
      player2TimeText: formatTimer(state.onevone.player2Seconds)
    }
  });
}

function updateTimerLoop() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  if (!state.onevone.timerRunning) return;
  timerInterval = window.setInterval(() => {
    if (state.onevone.activePlayer === 'p1') {
      state.onevone.player1Seconds += 1;
    } else {
      state.onevone.player2Seconds += 1;
    }
    applyTimerUI();
    if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
    saveSettings();
  }, 1000);
}

function startCapture(which) {
  captureTarget = which;
  let btn = swapKeyBtn;
  if (which === 'startStopKey') btn = startStopKeyBtn;
  if (which === 'teamOneScoreKey') btn = teamOneScoreKey;
  if (which === 'teamTwoScoreKey') btn = teamTwoScoreKey;
  if (which === 'resetScoreKey') btn = resetScoreKey;
  btn.textContent = 'Press key...';
  btn.classList.add('capturing');
}

function endCapture() {
  captureTarget = null;
  startStopKeyBtn.classList.remove('capturing');
  swapKeyBtn.classList.remove('capturing');
  teamOneScoreKey.classList.remove('capturing');
  teamTwoScoreKey.classList.remove('capturing');
  resetScoreKey.classList.remove('capturing');
  startStopKeyBtn.textContent = state.onevone.startStopKey;
  swapKeyBtn.textContent = state.onevone.swapKey;
  teamOneScoreKey.textContent = state.tournament.teamOneScoreKey;
  teamTwoScoreKey.textContent = state.tournament.teamTwoScoreKey;
  resetScoreKey.textContent = state.tournament.resetScoreKey;
}

function swapSides() {
  state.onevone.activePlayer = state.onevone.activePlayer === 'p1' ? 'p2' : 'p1';
  applyTimerUI();
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
}

function bumpTournamentScore(team, delta) {
  if (team === 'team1') {
    state.tournament.teamOneScore = Math.max(0, state.tournament.teamOneScore + delta);
  } else {
    state.tournament.teamTwoScore = Math.max(0, state.tournament.teamTwoScore + delta);
  }
  updateTournamentPreview();
  if (state.tournament.overlayEnabled) sendTournamentOverlayUpdate();
  saveSettings();
}

function resetTournamentScore() {
  state.tournament.teamOneScore = 0;
  state.tournament.teamTwoScore = 0;
  updateTournamentPreview();
  if (state.tournament.overlayEnabled) sendTournamentOverlayUpdate();
  saveSettings();
}

function resetToDefaults() {
  const fresh = structuredClone(defaults);
  Object.assign(state, fresh);
  applyCategoryView();
  applyMapsUI();
  applyOneVOneUI();
  applyTournamentUI();
  applySettingsUI();
  updateTimerLoop();
  saveSettings();
}

function bootUI() {
  if (regionSelect) regionSelect.value = state.region || 'NA';
  populateMaps(state.region || 'NA');
  populateFontOptions();
  applyCategoryView();
  applyMapsUI();
  applyOneVOneUI();
  applyTournamentUI();
  applySettingsUI();
  updateTimerLoop();
}

async function bootOverlayState() {
  if (state.mapOverlayEnabled) {
    const imagePath = `../images/${state.mapName}.png`;
    await window.api.openOverlay({
      mode: 'map',
      image: imagePath,
      opacity: getOverlayOpacity('map'),
      alwaysOnTop: getOverlayAlwaysOnTop('map'),
      fontFamily: state.settings.appFont
    });
    return;
  }

  if (state.onevone.overlayEnabled) {
    await openOneVOneOverlayIfEnabled();
    return;
  }

  if (state.tournament.overlayEnabled) {
    await openTournamentOverlayIfEnabled();
  }
}

category.addEventListener('change', () => {
  state.category = category.value;
  applyCategoryView();
  applyFeatureAccessUI();
  saveSettings();
});

if (regionSelect) {
  regionSelect.addEventListener('change', () => {
    state.region = regionSelect.value;
    populateMaps(state.region);
    state.mapName = mapList.value;
    updateMapPreview();
    saveSettings();
  });
}

mapList.addEventListener('change', () => {
  state.mapName = mapList.value;
  updateMapPreview();
  if (state.mapOverlayEnabled) {
    const imagePath = `../images/${state.mapName}.png`;
    window.api.updateOverlay({
      mode: 'map',
      image: imagePath,
      autoFit: false
    });
  }
  saveSettings();
});

mapOverlayEnabled.addEventListener('change', async () => {
  state.mapOverlayEnabled = mapOverlayEnabled.checked;

  if (state.mapOverlayEnabled) {
    state.onevone.overlayEnabled = false;
    state.tournament.overlayEnabled = false;
    applyOneVOneUI();
    applyTournamentUI();
    const imagePath = `../images/${state.mapName}.png`;
    await window.api.openOverlay({
      mode: 'map',
      image: imagePath,
      opacity: getOverlayOpacity('map'),
      alwaysOnTop: getOverlayAlwaysOnTop('map'),
      fontFamily: state.settings.appFont,
      autoFit: true
    });
  } else {
    await window.api.closeOverlay();
  }

  saveSettings();
});

closeOverlayBtn.addEventListener('click', async () => {
  await window.api.closeOverlay();
  state.mapOverlayEnabled = false;
  state.onevone.overlayEnabled = false;
  state.tournament.overlayEnabled = false;
  applyMapsUI();
  applyOneVOneUI();
  applyTournamentUI();
  saveSettings();
});

opacity.addEventListener('input', () => {
  setOverlayOpacity('map', parseFloat(opacity.value));
  syncOverlayWindowControlViews();
  window.api.updateOverlay({ mode: 'map', opacity: getOverlayOpacity('map') });
  saveSettings();
});

alwaysOnTop.addEventListener('change', () => {
  setOverlayAlwaysOnTop('map', alwaysOnTop.checked);
  syncOverlayWindowControlViews();
  window.api.updateOverlay({ mode: 'map', alwaysOnTop: getOverlayAlwaysOnTop('map') });
  saveSettings();
});

if (oneVOneOpacity) {
  oneVOneOpacity.addEventListener('input', () => {
    setOverlayOpacity('1v1', parseFloat(oneVOneOpacity.value));
    syncOverlayWindowControlViews();
    window.api.updateOverlay({ mode: '1v1', opacity: getOverlayOpacity('1v1') });
    saveSettings();
  });
}

if (oneVOneAlwaysOnTop) {
  oneVOneAlwaysOnTop.addEventListener('change', () => {
    setOverlayAlwaysOnTop('1v1', !!oneVOneAlwaysOnTop.checked);
    syncOverlayWindowControlViews();
    window.api.updateOverlay({ mode: '1v1', alwaysOnTop: getOverlayAlwaysOnTop('1v1') });
    saveSettings();
  });
}

if (oneVOneAnimationsEnabled) {
  oneVOneAnimationsEnabled.addEventListener('change', () => {
    state.onevone.animationsEnabled = !!oneVOneAnimationsEnabled.checked;
    if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
    saveSettings();
  });
}

if (tournamentOpacity) {
  tournamentOpacity.addEventListener('input', () => {
    setOverlayOpacity('4v1', parseFloat(tournamentOpacity.value));
    syncOverlayWindowControlViews();
    window.api.updateOverlay({ mode: '4v1', opacity: getOverlayOpacity('4v1') });
    saveSettings();
  });
}

if (tournamentAlwaysOnTop) {
  tournamentAlwaysOnTop.addEventListener('change', () => {
    setOverlayAlwaysOnTop('4v1', !!tournamentAlwaysOnTop.checked);
    syncOverlayWindowControlViews();
    window.api.updateOverlay({ mode: '4v1', alwaysOnTop: getOverlayAlwaysOnTop('4v1') });
    saveSettings();
  });
}

appFontSelect.addEventListener('change', () => {
  state.settings.appFont = appFontSelect.value;
  void applySelectedFontWithValidation();
  window.api.updateOverlay({ fontFamily: state.settings.appFont });
  saveSettings();
});

if (chooseCustomFontBtn) {
  chooseCustomFontBtn.addEventListener('click', async () => {
    const filePath = await window.api.chooseCustomFont();
    if (!filePath) return;

    if (!isValidCustomFontFile(filePath)) {
      setFontStatus('Invalid font file. Use .ttf, .otf, .woff, or .woff2.', 'error');
      return;
    }

    const existing = getCustomFontList();
    const existingByPath = existing.find((entry) => entry.path.toLowerCase() === filePath.toLowerCase());
    const fontName = existingByPath
      ? existingByPath.name
      : buildUniqueCustomFontName(filePath, existing);

    const nextFonts = existingByPath
      ? existing
      : [...existing, { name: fontName, path: filePath }];

    state.settings.customFontFiles = nextFonts;
    state.settings.appFont = fontName;
    populateFontOptions();
    applySettingsUI();
    saveSettings();
    setFontStatus(`Custom font added: ${fontName}`, 'success');
  });
}

if (removeCustomFontBtn) {
  removeCustomFontBtn.addEventListener('click', () => {
    const selected = findCustomFontEntry(state.settings.appFont || '');
    if (!selected) return;

    state.settings.customFontFiles = getCustomFontList().filter((entry) => entry.name !== selected.name);
    state.settings.appFont = 'Segoe UI';
    populateFontOptions();
    applySettingsUI();
    saveSettings();
    setFontStatus(`Removed custom font: ${selected.name}`, 'success');
  });
}

oneVOneOverlayEnabled.addEventListener('change', async () => {
  state.onevone.overlayEnabled = oneVOneOverlayEnabled.checked;
  if (state.onevone.overlayEnabled) {
    state.mapOverlayEnabled = false;
    state.tournament.overlayEnabled = false;
    applyMapsUI();
    applyTournamentUI();
  }
  applyOneVOneUI();
  if (state.onevone.overlayEnabled) {
    await openOneVOneOverlayIfEnabled();
  } else {
    await window.api.closeOverlay();
  }
  saveSettings();
});

player1Name.addEventListener('input', () => {
  state.onevone.player1Name = player1Name.value;
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
});

player2Name.addEventListener('input', () => {
  state.onevone.player2Name = player2Name.value;
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
});

player1NameColor.addEventListener('input', () => {
  state.onevone.player1NameColor = player1NameColor.value;
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
});

player2NameColor.addEventListener('input', () => {
  state.onevone.player2NameColor = player2NameColor.value;
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
});

scoreColor.addEventListener('input', () => {
  state.onevone.scoreColor = scoreColor.value;
  applyTimerUI();
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
});

timerColor.addEventListener('input', () => {
  state.onevone.timerColor = timerColor.value;
  applyTimerUI();
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
});

underlineColor.addEventListener('input', () => {
  state.onevone.underlineColor = underlineColor.value;
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
});

p1Minus.addEventListener('click', () => {
  state.onevone.player1Score -= 1;
  applyTimerUI();
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
});

p1Plus.addEventListener('click', () => {
  state.onevone.player1Score += 1;
  applyTimerUI();
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
});

p2Minus.addEventListener('click', () => {
  state.onevone.player2Score -= 1;
  applyTimerUI();
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
});

p2Plus.addEventListener('click', () => {
  state.onevone.player2Score += 1;
  applyTimerUI();
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
});

timerStartStopBtn.addEventListener('click', () => {
  state.onevone.timerRunning = !state.onevone.timerRunning;
  applyTimerUI();
  updateTimerLoop();
  saveSettings();
});

timerResetBtn.addEventListener('click', () => {
  state.onevone.player1Seconds = 0;
  state.onevone.player2Seconds = 0;
  state.onevone.activePlayer = 'p1';
  state.onevone.timerRunning = false;
  applyTimerUI();
  updateTimerLoop();
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
});

swapSidesBtn.addEventListener('click', () => {
  swapSides();
});

startStopKeyBtn.addEventListener('click', () => startCapture('startStopKey'));
swapKeyBtn.addEventListener('click', () => startCapture('swapKey'));

clearStartStopKey.addEventListener('click', () => {
  state.onevone.startStopKey = '-';
  startStopKeyBtn.textContent = state.onevone.startStopKey;
  saveSettings();
});

clearSwapKey.addEventListener('click', () => {
  state.onevone.swapKey = '-';
  swapKeyBtn.textContent = state.onevone.swapKey;
  saveSettings();
});

window.addEventListener('keydown', (ev) => {
  if (!authState.user) return;

  const targetTag = (ev.target && ev.target.tagName ? ev.target.tagName : '').toLowerCase();
  const isTypingField = targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select';

  if (captureTarget) {
    ev.preventDefault();
    const key = formatKey(ev);
    if (captureTarget === 'startStopKey') state.onevone.startStopKey = key;
    if (captureTarget === 'swapKey') state.onevone.swapKey = key;
    if (captureTarget === 'teamOneScoreKey') state.tournament.teamOneScoreKey = key;
    if (captureTarget === 'teamTwoScoreKey') state.tournament.teamTwoScoreKey = key;
    if (captureTarget === 'resetScoreKey') state.tournament.resetScoreKey = key;
    endCapture();
    saveSettings();
    return;
  }

  if (isTypingField) return;

  const pressed = formatKey(ev);
  if (pressed === state.onevone.startStopKey) {
    state.onevone.timerRunning = !state.onevone.timerRunning;
    applyTimerUI();
    updateTimerLoop();
    saveSettings();
  }

  if (pressed === state.onevone.swapKey) {
    swapSides();
  }

  if (hasFeatureAccess() && pressed === state.tournament.teamOneScoreKey) {
    bumpTournamentScore('team1', 1);
  }

  if (hasFeatureAccess() && pressed === state.tournament.teamTwoScoreKey) {
    bumpTournamentScore('team2', 1);
  }

  if (hasFeatureAccess() && pressed === state.tournament.resetScoreKey) {
    resetTournamentScore();
  }
});

teamOne.addEventListener('input', () => {
  state.tournament.teamOne = teamOne.value;
  updateTournamentPreview();
  if (state.tournament.overlayEnabled) sendTournamentOverlayUpdate();
  saveSettings();
});

teamTwo.addEventListener('input', () => {
  state.tournament.teamTwo = teamTwo.value;
  updateTournamentPreview();
  if (state.tournament.overlayEnabled) sendTournamentOverlayUpdate();
  saveSettings();
});

bestOf.addEventListener('change', () => {
  state.tournament.bestOf = bestOf.value;
  updateTournamentPreview();
  if (state.tournament.overlayEnabled) sendTournamentOverlayUpdate();
  saveSettings();
});

killerPick.addEventListener('change', () => {
  state.tournament.killer = killerPick.value;
  updateTournamentPreview();
  if (state.tournament.overlayEnabled) sendTournamentOverlayUpdate();
  saveSettings();
});

tournamentOverlayEnabled.addEventListener('change', async () => {
  if (!hasFeatureAccess()) {
    tournamentOverlayEnabled.checked = false;
    state.tournament.overlayEnabled = false;
    applyTournamentUI();
    applyFeatureAccessUI();
    saveSettings();
    return;
  }

  state.tournament.overlayEnabled = tournamentOverlayEnabled.checked;
  if (state.tournament.overlayEnabled) {
    state.mapOverlayEnabled = false;
    state.onevone.overlayEnabled = false;
    applyMapsUI();
    applyOneVOneUI();
    await openTournamentOverlayIfEnabled();
  } else {
    await window.api.closeOverlay();
  }
  applyTournamentUI();
  saveSettings();
});

closeTournamentOverlay.addEventListener('click', async () => {
  state.tournament.overlayEnabled = false;
  applyTournamentUI();
  await window.api.closeOverlay();
  saveSettings();
});

t1Minus.addEventListener('click', () => bumpTournamentScore('team1', -1));
t1Plus.addEventListener('click', () => bumpTournamentScore('team1', 1));
t2Minus.addEventListener('click', () => bumpTournamentScore('team2', -1));
t2Plus.addEventListener('click', () => bumpTournamentScore('team2', 1));

teamOneScoreKey.addEventListener('click', () => startCapture('teamOneScoreKey'));
teamTwoScoreKey.addEventListener('click', () => startCapture('teamTwoScoreKey'));
resetScoreKey.addEventListener('click', () => startCapture('resetScoreKey'));

clearTeamOneScoreKey.addEventListener('click', () => {
  state.tournament.teamOneScoreKey = '-';
  teamOneScoreKey.textContent = state.tournament.teamOneScoreKey;
  saveSettings();
});

clearTeamTwoScoreKey.addEventListener('click', () => {
  state.tournament.teamTwoScoreKey = '-';
  teamTwoScoreKey.textContent = state.tournament.teamTwoScoreKey;
  saveSettings();
});

clearResetScoreKey.addEventListener('click', () => {
  state.tournament.resetScoreKey = '-';
  resetScoreKey.textContent = state.tournament.resetScoreKey;
  saveSettings();
});

saveSettingsBtn.addEventListener('click', () => {
  saveSettings();
  saveSettingsBtn.textContent = 'Saved';
  window.setTimeout(() => {
    saveSettingsBtn.textContent = 'Save Now';
  }, 1000);
});

resetSettingsBtn.addEventListener('click', async () => {
  await window.api.closeOverlay();
  resetToDefaults();
});

chooseBackgroundVisualBtn.addEventListener('click', async () => {
  if (!hasFeatureAccess()) {
    setBackgroundValidation('Background visual customization is available to premium/tester/dev accounts.', 'warning');
    return;
  }

  const filePath = await window.api.chooseBackgroundMedia();
  if (!filePath) return;
  if (!isValidVisualFile(filePath)) {
    setBackgroundValidation('Invalid visual file. Choose png/jpg/jpeg/webp/gif/mp4/webm/ogg.', 'error');
    return;
  }

  const quality = await validateVisualResolution(filePath);
  if (!quality.ok) {
    const canUpscale = !!state.settings.allowVisualUpscale && quality.width > 0 && quality.height > 0;
    if (canUpscale) {
      state.settings.backgroundVisualPath = filePath;
      setBackgroundValidation(
        `Upscale mode enabled. Using ${quality.width}x${quality.height}; best clarity is 1080p or 4K.`,
        'warning'
      );
      applySettingsUI();
      saveSettings();
      return;
    }
    setBackgroundValidation(quality.message, 'error');
    return;
  }

  state.settings.backgroundVisualPath = filePath;
  setBackgroundValidation(quality.message, 'success');
  applySettingsUI();
  saveSettings();
});

chooseBackgroundAudioBtn.addEventListener('click', async () => {
  const filePath = await window.api.chooseBackgroundMedia();
  if (!filePath) return;
  if (!isValidAudioFile(filePath)) {
    setBackgroundValidation('Invalid audio file. Choose mp3/wav/ogg.', 'error');
    return;
  }
  state.settings.backgroundAudioStreamUrl = '';
  state.settings.backgroundAudioPath = filePath;
  setBackgroundValidation('Background audio updated.', 'success');
  applySettingsUI();
  saveSettings();
});

clearBackgroundVisualBtn.addEventListener('click', () => {
  if (!hasFeatureAccess()) {
    setBackgroundValidation('Background visual customization is available to premium/tester/dev accounts.', 'warning');
    return;
  }

  state.settings.backgroundVisualPath = '';
  setBackgroundValidation('Visual background cleared.', 'success');
  applySettingsUI();
  saveSettings();
});

clearBackgroundAudioBtn.addEventListener('click', () => {
  state.settings.backgroundAudioStreamUrl = '';
  state.settings.backgroundAudioPath = '';
  setBackgroundValidation('Background audio cleared.', 'success');
  applySettingsUI();
  saveSettings();
});

backgroundAudioEnabled.addEventListener('change', () => {
  state.settings.backgroundAudioEnabled = backgroundAudioEnabled.checked;
  applyBackgroundPlaybackSettings();
  saveSettings();
});

allowVisualUpscale.addEventListener('change', () => {
  state.settings.allowVisualUpscale = allowVisualUpscale.checked;
  if (state.settings.allowVisualUpscale) {
    setBackgroundValidation('Upscale mode enabled. Non-1080p/4K visuals are allowed with softer quality.', 'warning');
  } else {
    setBackgroundValidation('Strict mode enabled. Visuals must be exactly 1080p or 4K.', 'success');
  }
  saveSettings();
});

musicSearchBtn.addEventListener('click', async () => {
  const query = musicSearchInput.value.trim();
  if (!query) {
    musicValidation.textContent = 'Enter a song title or artist name.';
    musicValidation.classList.add('error');
    musicValidation.classList.remove('success', 'warning');
    musicValidation.classList.remove('hidden');
    return;
  }

  musicValidation.classList.add('hidden');
  musicSearchBtn.disabled = true;
  musicSearchBtn.textContent = 'Searching...';

  try {
    const songs = await searchSongs(query);
    displayMusicResults(songs);
  } catch (err) {
    musicValidation.textContent = err && err.message ? err.message : 'Song lookup failed.';
    musicValidation.classList.add('error');
    musicValidation.classList.remove('success', 'warning');
    musicValidation.classList.remove('hidden');
  }

  musicSearchBtn.disabled = false;
  musicSearchBtn.textContent = 'Search Songs';
});

function displayMusicResults(songs) {
  musicResultsList.innerHTML = '';
  if (!songs || songs.length === 0) {
    musicValidation.textContent = 'No songs found for that search. Try a different title or artist.';
    musicValidation.classList.add('warning');
    musicValidation.classList.remove('error', 'success');
    musicValidation.classList.remove('hidden');
    return;
  }

  songs.forEach((song) => {
    const item = document.createElement('div');
    item.className = 'music-result-item';
    const artistName = Array.isArray(song.artists) && song.artists.length > 0
      ? song.artists.map((a) => a.name).join(', ')
      : 'Unknown Artist';
    const cover = song.coverUrl || '';
    const duration = formatDurationMs(song.durationMs);

    item.innerHTML = `
      <img class="music-result-cover" src="${cover}" alt="${song.name}" />
      <div>
        <div class="music-result-meta">
          <p class="music-result-title">${song.name}</p>
          <span class="music-result-duration">${duration}</span>
        </div>
        <p class="music-result-artist">${artistName}</p>
      </div>
    `;
    item.addEventListener('click', () => selectSong(song));
    musicResultsList.appendChild(item);
  });

  musicSearchResults.classList.remove('hidden');
  musicValidation.classList.add('hidden');
}

function selectSong(song) {
  currentSelectedSong = song;
  const artistName = Array.isArray(song.artists) && song.artists.length > 0
    ? song.artists.map((a) => a.name).join(', ')
    : 'Unknown Artist';
  const duration = formatDurationMs(song.durationMs);

  selectedSongTitle.textContent = song.name;
  selectedSongArtist.textContent = `by ${artistName} • ${duration}`;

  musicSelection.classList.remove('hidden');
  musicSearchResults.classList.add('hidden');
  videoSearchResults.classList.add('hidden');
  musicValidation.classList.add('hidden');
}

loadMusicVideoBtn.addEventListener('click', async () => {
  if (!currentSelectedSong) return;

  loadMusicVideoBtn.disabled = true;
  loadMusicVideoBtn.textContent = 'Searching YouTube...';
  musicLoadStatus.classList.add('hidden');

  const artistName = currentSelectedSong.artists?.[0]?.name || '';
  const videoLink = generateYouTubeSearchLink(`${currentSelectedSong.name} ${artistName} official music video`);

  displayVideoResults([videoLink]);

  loadMusicVideoBtn.disabled = false;
  loadMusicVideoBtn.textContent = 'Find Music Video on YouTube';
});

playSongOnlyBtn.addEventListener('click', () => {
  if (!currentSelectedSong) return;

  const previewUrl = currentSelectedSong.previewUrl || '';
  if (!previewUrl) {
    musicLoadStatus.textContent = 'This song has no preview stream. Pick another result or use Choose Audio.';
    musicLoadStatus.classList.remove('hidden', 'success', 'warning');
    musicLoadStatus.classList.add('error');
    return;
  }

  // Song mode: play selected song preview while keeping the user's current visual.
  state.settings.backgroundAudioStreamUrl = previewUrl;
  state.settings.backgroundAudioPath = '';
  state.settings.backgroundAudioEnabled = true;
  applySettingsUI();
  saveSettings();

  musicLoadStatus.textContent = 'Song enabled. Your current custom video/visual stays active unless you change it.';
  musicLoadStatus.classList.remove('hidden', 'error', 'warning');
  musicLoadStatus.classList.add('success');
  videoSearchResults.classList.add('hidden');
});

function displayVideoResults(videos) {
  videoResultsList.innerHTML = '';
  if (!videos || videos.length === 0) {
    musicLoadStatus.textContent = 'No videos found.';
    musicLoadStatus.classList.remove('hidden');
    return;
  }

  videos.forEach((video) => {
    const item = document.createElement('div');
    item.className = 'video-result-item';
    item.innerHTML = `<p class="video-result-title">${video.title}</p><p class="video-result-artist"><a href="${video.link}" target="_blank" style="color: #4fc3ff; text-decoration: none;">Click to open search in browser →</a></p>`;
    videoResultsList.appendChild(item);
  });

  videoSearchResults.classList.remove('hidden');
  musicLoadStatus.innerHTML = '<strong>Found music video alternatives.</strong> Click the YouTube link to find and download the official video. After download, use "Choose Visual" to add it as your background.';
  musicLoadStatus.classList.remove('hidden');
}

clearMusicBtn.addEventListener('click', () => {
  currentSelectedSong = null;
  musicSelection.classList.add('hidden');
  musicSearchResults.classList.add('hidden');
  videoSearchResults.classList.add('hidden');
  musicSearchInput.value = '';
  musicValidation.classList.add('hidden');
  musicLoadStatus.classList.add('hidden');
});

if (appMinimizeBtn) {
  appMinimizeBtn.addEventListener('click', () => {
    window.api.minimizeWindow();
  });
}

if (appCloseBtn) {
  appCloseBtn.addEventListener('click', () => {
    window.api.closeWindow();
  });
}

if (authForm) {
  authForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    await loginWithServer();
  });
}

if (authRegisterForm) {
  authRegisterForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    await registerWithServer();
  });
}

if (showCreateAccountBtn) {
  showCreateAccountBtn.addEventListener('click', () => {
    setAuthStatus('', '');
    setAuthMode('register');
  });
}

if (showLoginBtn) {
  showLoginBtn.addEventListener('click', () => {
    setAuthRegisterStatus('', '');
    setAuthMode('login');
  });
}

if (authLogoutBtn) {
  authLogoutBtn.addEventListener('click', async () => {
    await window.api.authLogout();
    await window.api.closeOverlay();
    authState = { user: null, serverUrl: authState.serverUrl || DEFAULT_AUTH_SERVER_URL };
    if (!(authRememberMe && authRememberMe.checked)) {
      const savedServerUrl = (authState.serverUrl || DEFAULT_AUTH_SERVER_URL).trim();
      saveAuthPrefs({ serverUrl: savedServerUrl, username: '', password: '', rememberMe: false });
      authUsername.value = '';
      authPassword.value = '';
    }
    applyAuthUI();
    setAuthStatus('Logged out.', 'success');
  });
}

if (buyPremiumBtn) {
  buyPremiumBtn.addEventListener('click', async () => {
    await window.api.openExternalUrl(DISCORD_BUY_URL);
  });
}

if (sponsorVdlBtn) {
  sponsorVdlBtn.addEventListener('click', async () => {
    await window.api.openExternalUrl(DISCORD_SPONSOR_URL);
  });
}

backgroundVolume.addEventListener('input', () => {
  const pct = Number(backgroundVolume.value) || 0;
  state.settings.backgroundVolume = Math.max(0, Math.min(1, pct / 100));
  backgroundVolumeValue.textContent = `${pct}%`;
  applyBackgroundPlaybackSettings();
  saveSettings();
});

applyAuthUI();
setAuthMode('login');
void restoreSession();
