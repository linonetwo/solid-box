const { app } = require('electron');
const path = require('path');

exports.iconPath = path.join(
  process.env.NODE_ENV !== 'development' ? process.resourcesPath : 'resources',
  'icon.icns',
);

const serverDataFolderPath = path.join(app.getPath('appData'), 'solid-box', 'data');
exports.serverDataFolderPath = serverDataFolderPath;
exports.keyFolder = path.join(serverDataFolderPath, 'keys');

const isWin = process.platform === 'win32';
const isMac = process.platform === 'darwin';
exports.isMac = isMac;

exports.DEFAULT_HOSTS = isWin
  ? 'C:/Windows/System32/drivers/etc/hosts'
  : '/etc/hosts';
exports.tempFolderPath = path.join(app.getPath('temp'), 'solid-box');


const solidPort = 50110; // SoliD 501i0
exports.solidPort = solidPort;
exports.solidHost = `https://localhost:${solidPort}`;

exports.isDev = process.env.NODE_ENV === 'development';
const appDevPort = 40992; // Hardcoded; needs to match webpack.development.js and package.json
exports.appDevPort = appDevPort;
exports.selfHost = `http://localhost:${appDevPort}`;