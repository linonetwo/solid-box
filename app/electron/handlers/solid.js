const { app, ipcMain } = require('electron');
const path = require('path');
const solid = require('solid-server');
const shell = require('shelljs');
// Get full chain CA and local CA added by mkcert, so secure TLS can be established
const sslRootCAs = require('ssl-root-cas/latest');
const https = require('https');
const { exec } = require('child_process');

const solidDefaultSettings = require('../../../solid.config.example.json');

const port = 8443;
const serverDataFolderPath = path.join(app.getPath('appData'), 'solid-box');
const keyFolder = path.join(serverDataFolderPath, 'keys');

let server;
ipcMain.on('start-server', async (event, args) => {
  if (args === 'generate-keys') {
    exec(
      `mkdir -p "${keyFolder}" && cd "${keyFolder}" && mkcert localhost solidbox.localhost 127.0.0.1`,
      (err, stdout, stderr) => {
        if (!err) {
          event.reply('generate-keys-succeed');
        }
        shell.echo('generate-keys', stdout, stderr);
      },
    );
  } else if (args === 'solid-server') {
    server = solid.createServer({
      ...solidDefaultSettings,
      dbPath: path.join(serverDataFolderPath, '.db'),
      configPath: path.join(serverDataFolderPath, 'config'),
      sslKey: path.join(keyFolder, 'localhost+2-key.pem'),
      sslCert: path.join(keyFolder, 'localhost+2.pem'),
      root: serverDataFolderPath,
    });

    exec(`echo $(mkcert -CAROOT)/rootCA.pem`, (err, stdout) => {
      const mkcertRootCAPath = stdout.replace('\n', '');
      const rootCAs = sslRootCAs.create();
      rootCAs.addFile(mkcertRootCAPath);
      https.globalAgent.options.ca = rootCAs;

      server.listen(port, () => {
        event.reply('solid-progress', 'solid-started');
        shell.echo(
          `
          Started SoLiD app at https://localhost:${port}
          And files are stored in "${serverDataFolderPath}"`,
        );
      });
    });

    app.on('before-quit', () => {
      server.close();
    });
  }
});
