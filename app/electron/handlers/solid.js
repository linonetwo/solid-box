const { app, ipcMain } = require('electron');
const path = require('path');
const solid = require('solid-server');
const express = require('express');
const shell = require('shelljs');
// Get full chain CA and local CA added by mkcert, so secure TLS can be established
const sslRootCAs = require('ssl-root-cas/latest')
const https = require('https')
const { exec } = require('child_process');

const solidDefaultSettings = require('../../../solid.config.example.json');

const port = 18435;
let server;
ipcMain.on('start-server', async event => {
  server = express();
  const serverDataFolderPath = path.join(app.getPath('appData'), 'solid box');
  server.use(
    '/test',
    solid({
      ...solidDefaultSettings,
      dbPath: path.join(serverDataFolderPath, '.db'),
      configPath: path.join(serverDataFolderPath, 'config'),
      root: serverDataFolderPath,
    }),
  );

  exec(`echo $(mkcert -CAROOT)/rootCA.pem`, (err, stdout) => {
    const mkcertRootCAPath = stdout.replace('\n', '');
    const rootCAs = sslRootCAs.create();
    rootCAs.addFile(mkcertRootCAPath);
    https.globalAgent.options.ca = rootCAs;
  
    server.listen(port, () => {
      event.reply('solid-progress', 'solid-started');
      shell.echo(
        `Started Express app with ldp on '/test' at https://localhost:${port}
        Files are stored in "${serverDataFolderPath}"`,
      );
    });
  })

  app.on('before-quit', () => {
    server.close();
  });
});
