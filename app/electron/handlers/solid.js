const { app, ipcMain } = require('electron');
const path = require('path');
const solid = require('solid-server');
const shell = require('shelljs');
// Get full chain CA and local CA added by mkcert, so secure TLS can be established
const sslRootCAs = require('ssl-root-cas/latest');
const https = require('https');
const { exec } = require('child_process');

const sudo = require('sudo-prompt');
const Hosts = require('hosts-so-easy').default;

const { iconPath, serverDataFolderPath, keyFolder, DEFAULT_HOSTS, tempFolderPath, solidPort, solidHost } = require('../constants');
const solidDefaultSettings = require('../../../solid.config.example.json');


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
      port: solidPort,
      serverUri: solidHost,
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

      server.listen(solidPort, () => {
        event.reply('solid-progress', 'solid-started');
        shell.echo(
          `
          Started SoLiD app at ${solidHost}
          And files are stored in "${serverDataFolderPath}"`,
        );
      });
    });

    app.on('before-quit', () => {
      server.close();
    });
  } else if (args === 'add-hosts') {
    shell.mkdir('-p', tempFolderPath);
    shell.cp(DEFAULT_HOSTS, tempFolderPath);
    const tempHostsPath = path.join(tempFolderPath, 'hosts');
    const hosts = new Hosts({
      hostsFile: tempHostsPath,
    });
    hosts.add('127.0.0.1', 'solidbox.localhost');
    await hosts.updateFinish();
    const options = {
      name: 'Electron',
      icns: iconPath,
    };
    sudo.exec(`mv ${tempHostsPath} /etc/hosts`, options, (error, stdout) => {
      if (error) throw error;
      console.log(`stdout: ${stdout}`);
    });
  } else if (args === 'check') {
    try {
      await fetch(solidHost);
      event.reply('solid-progress', 'solid-started');
    } catch (error) {
      event.reply('solid-progress', 'solid-not-started');
    }
  }
});
