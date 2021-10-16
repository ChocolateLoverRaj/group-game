/* global MAIN_WINDOW_WEBPACK_ENTRY */
const { app, session } = require('electron')
const windowStateKeeper = require('electron-window-state')
const { BrowserWindow } = require('electron')
const { enable, initialize } = require('@electron/remote/main')

initialize()

app.whenReady().then(() => {
  // From https://github.com/mawie81/electron-window-state/blob/2701d9a0f90a44dc8dbf81430538ceb16c9ff27a/readme.md
  // Load the previous state with fallback to defaults
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800
  })

  // Create the window using the state information
  const win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  enable(win.webContents)

  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state
  mainWindowState.manage(win)

  // From https://www.electronjs.org/docs/latest/tutorial/security#csp-http-header
  // Or https://web.archive.org/web/20211013155814/https://www.electronjs.org/docs/latest/tutorial/security#csp-http-header
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    // eslint-disable-next-line node/no-callback-literal
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["default-src 'self' 'unsafe-eval' 'unsafe-inline'"]
      }
    })
  })

  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
})
