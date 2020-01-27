const {
  app,
  ipcMain,
  shell: electronShell,
  BrowserWindow,
} = require('electron');
const path = require('path');
const solid = require('solid-server');
const shell = require('shelljs');
// Get full chain CA and local CA added by mkcert, so secure TLS can be established
const sslRootCAs = require('ssl-root-cas/latest');
const https = require('https');
const { exec } = require('child_process');
const fs = require('fs').promises;

const sudo = require('sudo-prompt');
const Hosts = require('hosts-so-easy').default;

const {
  iconPath,
  serverDataFolderPath,
  keyFolder,
  DEFAULT_HOSTS,
  tempFolderPath,
} = require('../constants');
const { solidPort, solidHost } = require('../../src/constants/solid');
const solidDefaultSettings = require('../../../solid.config.example.json');

async function getSolidHosts() {
  const subFolders = await fs.readdir(serverDataFolderPath);
  const solidHosts = subFolders.filter(name => name.endsWith('localhost'));
  return solidHosts;
}

let server;
ipcMain.on('start-server', async (event, args) => {
  if (args === 'generate-keys') {
    const solidHosts = await getSolidHosts();
    exec(
      `mkdir -p "${keyFolder}" && cd "${keyFolder}" && mkcert -key-file key.pem -cert-file cert.pem ${solidHosts.join(
        ' ',
      )} 127.0.0.1`,
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
      sslKey: path.join(keyFolder, 'key.pem'),
      sslCert: path.join(keyFolder, 'cert.pem'),
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
    const solidHosts = await getSolidHosts();
    hosts.add('127.0.0.1', solidHosts);
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
      await fs.stat(keyFolder);
    } catch (error) {
      event.reply('solid-progress', 'no-key');
      return;
    }
    try {
      await fetch(solidHost);
      event.reply('solid-progress', 'solid-started');
    } catch (error) {
      event.reply('solid-progress', 'solid-not-started');
    }
  } else if (args === 'open-external') {
    electronShell.openExternal(solidHost);
  } else if (args === 'open-electron') {
    BrowserWindow.loadURL(solidHost);
  }
});
