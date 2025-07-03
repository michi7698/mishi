const monacoLoader = document.createElement('script')
monacoLoader.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js'
document.head.appendChild(monacoLoader)

monacoLoader.onload = () => {
  require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } })
  require(['vs/editor/editor.main'], function () {
    const editor = monaco.editor.create(document.getElementById('editor'), {
      value: '// Welcome to LeahScript\nUsing Leah script\n',
      language: 'javascript',
      theme: 'vs-dark',
      automaticLayout: true
    })

    const fileList = document.getElementById('file-list')
    const projectPath = './scripts'
    let currentFile = null

    // For demo, no backend readDir/readFile implemented here

    function logToConsole(msg) {
      const consoleEl = document.getElementById('console')
      consoleEl.innerText = msg
    }

    async function saveAs() {
      const { filePath, canceled } = await window.electronAPI.showSaveDialog({
        filters: [{ name: 'LeahScript', extensions: ['leahscript', 'txt'] }]
      })
      if (!canceled && filePath) {
        const content = editor.getValue()
        const result = await window.electronAPI.saveFile(filePath, content)
        if (result.success) {
          currentFile = filePath
          logToConsole(`Guardado como ${filePath}`)
          // TODO: update file list if you implement loading
        } else {
          logToConsole(`Error guardando: ${result.error}`)
        }
      }
    }

    window.electronAPI.onMenuSave(() => {
      if (currentFile) {
        const content = editor.getValue()
        window.electronAPI.saveFile(currentFile, content).then(result => {
          if (result.success) {
            logToConsole(`Guardado en ${currentFile}`)
          } else {
            logToConsole(`Error guardando: ${result.error}`)
          }
        })
      } else {
        saveAs()
      }
    })

    window.electronAPI.onMenuSaveAs(() => {
      saveAs()
    })
  })
}
