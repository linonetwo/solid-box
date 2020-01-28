/* eslint-disable global-require, no-param-reassign */
const { app, protocol, BrowserWindow, session, ipcMain } = require('electron');
const i18nextBackend = require('i18next-electron-fs-backend');
const path = require('path');
const fs = require('fs');
const fixPath = require('fix-path');

fixPath();

const Protocol = require('./protocol');
const MenuBuilder = require('./menu');
require('./handlers');
const { isDev, selfHost } = require('./constants');
const { solidHost } = require('../src/constants/solid');

// Installs extensions useful for development;
// https://github.com/electron-react-boilerplate/electron-react-boilerplate/blob/master/app/main.dev.js
// NOTE - if you'd like to run w/ these extensions when testing w/o electron, you need browser extensions to be installed (React Developer Tools & Redux DevTools)
const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload)),
  ).catch(console.log);
};

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let menuBuilder;

async function createWindow() {
  if (isDev) {
    await installExtensions();
  } else {
    // Needs to happen before creating/loading the browser window;
    // not necessarily instead of extensions, just using this code block
    // so I don't have to write another 'if' statement
    protocol.registerBufferProtocol(Protocol.scheme, Protocol.requestHandler);
  }

  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      devTools: isDev,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      webviewTag: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  // Sets up main.js bindings for our i18next backend
  i18nextBackend.mainBindings(ipcMain, win, fs);

  // Load app
  if (isDev) {
    win.loadURL(selfHost);
  } else {
    win.loadURL(`${Protocol.scheme}://rse/index-prod.html`);
  }

  // Only do these things when in development
  if (isDev) {
    win.webContents.openDevTools();
    require('electron-debug')(); // https://github.com/sindresorhus/electron-debug
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  // https://electronjs.org/docs/tutorial/security#4-handle-session-permission-requests-from-remote-content
  const partition = 'default';
  session
    .fromPartition(partition)
    .setPermissionRequestHandler((_, permission, callback) => {
      const allowedPermissions = []; // Full list here: https://developer.chrome.com/extensions/declare_permissions#manifest

      if (allowedPermissions.includes(permission)) {
        callback(true); // Approve permission request
      } else {
        console.error(
          `The application tried to request permission for '${permission}'. This permission was not whitelisted and has been blocked.`,
        );

        callback(false); // Deny
      }
    });

  // https://electronjs.org/docs/tutorial/security#1-only-load-secure-content;
  // The below code can only run when a scheme and host are defined, I thought
  // we could use this over _all_ urls
  // ses.fromPartition(partition).webRequest.onBeforeRequest({urls:["http://localhost./*"]}, (listener) => {
  //   if (listener.url.indexOf("http://") >= 0) {
  //     listener.callback({
  //       cancel: true
  //     });
  //   }
  // });

  menuBuilder = MenuBuilder(win);
  menuBuilder.buildMenu();
}

// Needs to be called before app is ready;
// gives our scheme access to load relative files,
// as well as local storage, cookies, etc.
// https://electronjs.org/docs/api/protocol#protocolregisterschemesasprivilegedcustomschemes
protocol.registerSchemesAsPrivileged([
  {
    scheme: Protocol.scheme,
    privileges: { standard: true, secure: true },
  },
]);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
  //   app.quit();
  // }
  win = null;
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (typeof win === 'undefined' || win === null || win.isDestroyed()) {
    createWindow();
  }
});

// https://electronjs.org/docs/tutorial/security#12-disable-or-limit-navigation
app.on('web-contents-created', (e, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    const validOrigins = [selfHost, solidHost];

    // Log and prevent the app from navigating to a new page if that page's origin is not whitelisted
    if (!validOrigins.includes(parsedUrl.origin)) {
      console.error(
        `The application tried to redirect to the following address: '${parsedUrl}'. This origin is not whitelisted and the attempt to navigate was blocked.`,
      );

      event.preventDefault();
    }
  });

  // contents.on('will-redirect', (event, navigationUrl) => {
  //   const parsedUrl = new URL(navigationUrl);
  //   const validOrigins = [solidHost];

  //   // Log and prevent the app from redirecting to a new page
  //   if (!validOrigins.includes(parsedUrl.origin)) {
  //     console.error(
  //       `The application tried to redirect to the following address: '${navigationUrl}'. This attempt was blocked.`,
  //     );

  //     event.preventDefault();
  //   }
  // });

  // https://electronjs.org/docs/tutorial/security#11-verify-webview-options-before-creation
  contents.on('will-attach-webview', (_, webPreferences) => {
    // Strip away preload scripts if unused or verify their location is legitimate
    delete webPreferences.preload;
    delete webPreferences.preloadURL;

    // Disable Node.js integration
    webPreferences.nodeIntegration = false;
  });

  // https://electronjs.org/docs/tutorial/security#13-disable-or-limit-creation-of-new-windows
  // contents.on('new-window', async (event, navigationUrl) => {
  //   // Log and prevent opening up a new window
  //   console.error(
  //     `The application tried to open a new window at the following address: '${navigationUrl}'. This attempt was blocked.`,
  //   );

  //   event.preventDefault();
  // });
});

// Filter loading any module via remote;
// you shouldn't be using remote at all, though
// https://electronjs.org/docs/tutorial/security#16-filter-the-remote-module
app.on('remote-require', event => {
  event.preventDefault();
});

app.on('remote-get-builtin', event => {
  event.preventDefault();
});

app.on('remote-get-global', event => {
  event.preventDefault();
});

app.on('remote-get-current-window', event => {
  event.preventDefault();
});

app.on('remote-get-current-web-contents', event => {
  event.preventDefault();
});
