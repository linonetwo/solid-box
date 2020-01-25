const { app, ipcMain } = require('electron');
const path = require('path');
const solid = require('solid-server');
const express = require('express');
const shell = require('shelljs');
const solidDefaultSettings = require('../../../solid.config.example.json');

const port = 18435;
let server;
ipcMain.on('start-server', async event => {
  server = express();
  const serverDataFolderPath = path.join(app.getPath('appData'), 'solid box');
  server.use(
    '/test',
    solid({ ...solidDefaultSettings, root: serverDataFolderPath }),
  );
  server.listen(port, () => {
    event.reply('solid-progress', 'solid-started');
    shell.echo(
      `Started Express app with ldp on '/test' at https://localhost:${port}
      Files are stored in ${serverDataFolderPath}`,
    );
  });
});
