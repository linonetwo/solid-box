const { app, Menu, MenuItem, BrowserWindow } = require("electron");
const isMac = process.platform === "darwin";

var MenuBuilder = function (mainWindow) {

  let setupDevelopmentEnvironment = function () {
    mainWindow.webContents.on("context-menu", (e, props) => {
      const {
        x,
        y
      } = props;

      Menu.buildFromTemplate([{
        label: "Inspect element",
        click: () => {
          mainWindow.inspectElement(x, y);
        }
      }]).popup(mainWindow);
    });
  }

  // https://electronjs.org/docs/api/menu#main-process
  let defaultTemplate = function() {
    return [
      // { role: "appMenu" }
      ...(isMac ? [{
        label: app.name,
        submenu: [{
            role: "about"
          },
          {
            type: "separator"
          },
          {
            role: "services"
          },
          {
            type: "separator"
          },
          {
            role: "hide"
          },
          {
            role: "hideothers"
          },
          {
            role: "unhide"
          },
          {
            type: "separator"
          },
          {
            role: "quit"
          }
        ]
      }] : []),
      // { role: "fileMenu" }
      {
        label: "File",
        submenu: [
          isMac ? {
            role: "close"
          } : {
            role: "quit"
          }
        ]
      },
      // { role: "editMenu" }
      {
        label: "Edit",
        submenu: [{
            role: "undo"
          },
          {
            role: "redo"
          },
          {
            type: "separator"
          },
          {
            role: "cut"
          },
          {
            role: "copy"
          },
          {
            role: "paste"
          },
          ...(isMac ? [{
              role: "pasteAndMatchStyle"
            },
            {
              role: "delete"
            },
            {
              role: "selectAll"
            },
            {
              type: "separator"
            },
            {
              label: "Speech",
              submenu: [{
                  role: "startspeaking"
                },
                {
                  role: "stopspeaking"
                }
              ]
            }
          ] : [{
              role: "delete"
            },
            {
              type: "separator"
            },
            {
              role: "selectAll"
            }
          ])
        ]
      },
      // { role: "viewMenu" }
      {
        label: "View",
        submenu: [{
            role: "reload"
          },
          {
            role: "forcereload"
          },
          {
            role: "toggledevtools"
          },
          {
            type: "separator"
          },
          {
            role: "resetzoom"
          },
          {
            role: "zoomin"
          },
          {
            role: "zoomout"
          },
          {
            type: "separator"
          },
          {
            role: "togglefullscreen"
          }
        ]
      },
      // { role: "windowMenu" }
      {
        label: "Window",
        submenu: [{
            role: "minimize"
          },
          {
            role: "zoom"
          },
          ...(isMac ? [{
              type: "separator"
            },
            {
              role: "front"
            },
            {
              type: "separator"
            },
            {
              role: "window"
            }
          ] : [{
            role: "close"
          }])
        ]
      },
      {
        role: "help",
        submenu: [{
          label: "Learn More",
          click: async () => {
            const {
              shell
            } = require("electron")
            await shell.openExternal("https://electronjs.org")
          }
        }]
      }
    ]
  }

  return {
    buildMenu: function () {
      if (process.env.NODE_ENV === "development") {
        setupDevelopmentEnvironment();
      }

      const menu = Menu.buildFromTemplate(defaultTemplate());
      Menu.setApplicationMenu(menu);

      return menu;
    }
  }
}

module.exports = MenuBuilder;