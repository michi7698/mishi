const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
    }
  })

  win.loadFile('index.html')
  createMenu(win)

  return win
}

function createMenu(win) {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Guardar',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            win.webContents.send('menu-save')
          }
        },
        {
          label: 'Guardar Como',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => {
            win.webContents.send('menu-save-as')
          }
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

app.whenReady().then(() => {
  const win = createWindow()

  ipcMain.handle('save-file', async (event, filePath, content) => {
    try {
      await fs.promises.writeFile(filePath, content, 'utf-8')
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('show-save-dialog', async (event, options) => {
    const result = await dialog.showSaveDialog(win, options)
    return result
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
