const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  openOverlay: (opts) => ipcRenderer.invoke('open-overlay', opts),
  closeOverlay: () => ipcRenderer.invoke('close-overlay'),
  updateOverlay: (opts) => ipcRenderer.send('update-overlay', opts),
  setAlwaysOnTop: (val) => ipcRenderer.send('set-always-on-top', val),
  setOpacity: (val) => ipcRenderer.send('set-opacity', val),
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  chooseBackgroundMedia: () => ipcRenderer.invoke('choose-background-media'),
  chooseCustomFont: () => ipcRenderer.invoke('choose-custom-font'),
  spotifySearchTracks: (payload) => ipcRenderer.invoke('spotify-search-tracks', payload),
  authLogin: (payload) => ipcRenderer.invoke('auth-login', payload),
  authRegister: (payload) => ipcRenderer.invoke('auth-register', payload),
  authMe: (payload) => ipcRenderer.invoke('auth-me', payload),
  authLogout: () => ipcRenderer.invoke('auth-logout'),
  openExternalUrl: (url) => ipcRenderer.invoke('open-external-url', url),
  checkUpdates: () => ipcRenderer.invoke('check-updates'),
  restartApp: () => ipcRenderer.invoke('restart-app'),
  on: (channel, cb) => ipcRenderer.on(channel, (e, ...args) => cb(...args))
});
