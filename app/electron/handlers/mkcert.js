const { ipcMain } = require('electron');
const shell = require('shelljs');
const dl = require('retriable-download');

shell.config.execPath = shell.which('node').toString();

ipcMain.on('install-packages', async (event, arg) => {
  switch (arg) {
    case 'check-mkcert': {
      if (!shell.which('mkcert')) {
        shell.echo('Mkcert Not Installed');
        event.reply('install-packages', 'mkcert-not-installed');
      } else {
        shell.echo('Mkcert Already Installed');
        event.reply('install-packages', 'mkcert-already-installed');
      }
      break;
    }
    case 'install-mkcert': {
      const systemType = process.platform;
      const retries = 3;
      if (systemType === 'darwin') {
        // https://github.com/FiloSottile/mkcert#macos
        shell.exec('HOMEBREW_NO_AUTO_UPDATE=1 brew install mkcert', (returnCode, stdout, stderr) => {
          if (stderr) {
            event.reply('install-packages-progress', stderr);
          }
          event.reply('install-packages-progress', stdout);
          if (returnCode === 0) {
            shell.echo('Mkcert Successfully Installed');
            event.reply('install-packages', 'mkcert-installed');
          } else {
            shell.echo('Mkcert Install Failed');
            event.reply('install-packages', 'mkcert-install-failed');
          }
        });
      } else if (systemType === 'linux') {
        // TODO: detect more package managers https://unix.stackexchange.com/questions/46081/identifying-the-system-package-manager
        // https://github.com/FiloSottile/mkcert#linux
        let returnCode = shell.exec('sudo apt install libnss3-tools').code;
        if (returnCode !== 0) {
          const fileURI =
            'https://github.com/FiloSottile/mkcert/releases/download/v1.4.1/mkcert-v1.4.1-linux-amd64';
          const fileLocation = await dl(fileURI, retries);
          shell.exec(`chmod + x ${fileLocation}`);
          returnCode = shell.exec(fileLocation).code;
        }
      } else if (systemType === 'win32' || systemType === 'win64') {
        const fileURI =
          'https://github.com/FiloSottile/mkcert/releases/download/v1.4.1/mkcert-v1.4.1-windows-amd64.exe';
        const fileLocation = await dl(fileURI, retries);
        const returnCode = shell.exec(fileLocation).code;
        console.log(returnCode);
      }

      break;
    }
    default:
      break;
  }
});
