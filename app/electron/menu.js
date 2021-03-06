const { app, Menu, shell } = require('electron');
const i18nBackend = require('i18next-electron-fs-backend');
const whitelist = require('../localization/whitelist');
const {
  isDev,
  isMac,
  selfHost,
  serverDataFolderPath,
  DEFAULT_HOSTS,
} = require('./constants');
const { solidHost } = require('../src/constants/solid');
const Protocol = require('./protocol');

function MenuBuilder(mainWindow) {
  const setupDevelopmentEnvironment = () => {
    mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            mainWindow.inspectElement(x, y);
          },
        },
      ]).popup(mainWindow);
    });
  };

  // https://electronjs.org/docs/api/menu#main-process
  const defaultTemplate = () => {
    return [
      // { role: "appMenu" }
      ...(isMac
        ? [
            {
              label: app.name,
              submenu: [
                {
                  role: 'about',
                },
                {
                  type: 'separator',
                },
                {
                  role: 'services',
                },
                {
                  type: 'separator',
                },
                {
                  role: 'hide',
                },
                {
                  role: 'hideothers',
                },
                {
                  role: 'unhide',
                },
                {
                  type: 'separator',
                },
                {
                  role: 'quit',
                },
              ],
            },
          ]
        : []),
      {
        label: 'Open',
        submenu: [
          {
            label: 'Settings',
            click: (menuItem, browserWindow) => {
              if (isDev) {
                browserWindow.loadURL(selfHost);
              } else {
                browserWindow.loadURL(
                  `${Protocol.scheme}://rse/index-prod.html`,
                );
              }
            },
          },
          {
            label: 'SoLiD',
            click: (menuItem, browserWindow) => {
              browserWindow.loadURL(solidHost);
            },
          },
          {
            label: 'SoLiD Folder',
            click: () => {
              shell.openItem(serverDataFolderPath);
            },
          },
          {
            label: 'Hosts',
            click: () => {
              shell.openItem(DEFAULT_HOSTS);
            },
          },
        ],
      },
      // { role: "fileMenu" }
      {
        label: 'File',
        submenu: [
          isMac
            ? {
                role: 'close',
              }
            : {
                role: 'quit',
              },
        ],
      },
      // { role: "editMenu" }
      {
        label: 'Edit',
        submenu: [
          {
            role: 'undo',
          },
          {
            role: 'redo',
          },
          {
            type: 'separator',
          },
          {
            role: 'cut',
          },
          {
            role: 'copy',
          },
          {
            role: 'paste',
          },
          ...(isMac
            ? [
                {
                  role: 'pasteAndMatchStyle',
                },
                {
                  role: 'delete',
                },
                {
                  role: 'selectAll',
                },
                {
                  type: 'separator',
                },
                {
                  label: 'Speech',
                  submenu: [
                    {
                      role: 'startspeaking',
                    },
                    {
                      role: 'stopspeaking',
                    },
                  ],
                },
              ]
            : [
                {
                  role: 'delete',
                },
                {
                  type: 'separator',
                },
                {
                  role: 'selectAll',
                },
              ]),
        ],
      },
      // { role: "viewMenu" }
      {
        label: 'View',
        submenu: [
          {
            role: 'reload',
          },
          {
            role: 'forcereload',
          },
          {
            role: 'toggledevtools',
          },
          {
            type: 'separator',
          },
          {
            role: 'resetzoom',
          },
          {
            role: 'zoomin',
          },
          {
            role: 'zoomout',
          },
          {
            type: 'separator',
          },
          {
            role: 'togglefullscreen',
          },
        ],
      },
      // { role: "windowMenu" }
      {
        label: 'Window',
        submenu: [
          {
            role: 'minimize',
          },
          {
            role: 'zoom',
          },
          ...(isMac
            ? [
                {
                  type: 'separator',
                },
                {
                  role: 'front',
                },
                {
                  type: 'separator',
                },
                {
                  role: 'window',
                },
              ]
            : [
                {
                  role: 'close',
                },
              ]),
        ],
      },
      {
        label: 'Language',
        submenu: whitelist.buildSubmenu(i18nBackend.changeLanguageRequest),
      },
      {
        role: 'help',
        submenu: [
          {
            label: 'Learn More',
            click: async () => {
              await shell.openExternal('https://electronjs.org');
            },
          },
        ],
      },
    ];
  };

  return {
    buildMenu() {
      if (isDev) {
        setupDevelopmentEnvironment();
      }

      const menu = Menu.buildFromTemplate(defaultTemplate());
      Menu.setApplicationMenu(menu);

      return menu;
    },
  };
}

module.exports = MenuBuilder;
