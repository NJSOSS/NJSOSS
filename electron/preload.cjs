const { contextBridge, ipcRenderer } = require('electron');

// Expose a minimal safe API to the renderer
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isElectron: true,
  versions: {
    node: process.versions.node,
    electron: process.versions.electron,
    chrome: process.versions.chrome,
  },
});
