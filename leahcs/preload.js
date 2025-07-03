const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  onMenuSave: (callback) => ipcRenderer.on('menu-save', callback),
  onMenuSaveAs: (callback) => ipcRenderer.on('menu-save-as', callback),
  saveFile: (filePath, content) => ipcRenderer.invoke('save-file', filePath, content),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options)
})
