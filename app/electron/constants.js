const { app } = require('electron');
const path = require('path');

exports.iconPath = path.join(
  process.env.NODE_ENV !== 'development' ? process.resourcesPath : 'resources',
  'icon.icns',
);

const serverDataFolderPath = path.join(app.getPath('appData'), 'solid-box');
exports.serverDataFolderPath = serverDataFolderPath;
exports.keyFolder = path.join(serverDataFolderPath, 'keys');

const isWin = process.platform === 'win32';
exports.DEFAULT_HOSTS = isWin
  ? 'C:/Windows/System32/drivers/etc/hosts'
  : '/etc/hosts';
exports.tempFolderPath = path.join(app.getPath('temp'), 'solid-box');
