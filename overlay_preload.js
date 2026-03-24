const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('overlayApi', {
  onUpdate: (cb) => ipcRenderer.on('overlay-update', (e, args) => cb(args)),
  getBounds: () => ipcRenderer.invoke('get-overlay-bounds'),
  setBounds: (bounds) => ipcRenderer.send('set-overlay-bounds', bounds)
});
