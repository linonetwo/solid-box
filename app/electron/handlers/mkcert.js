const { ipcMain } = require("electron");
const shell = require("shelljs");

ipcMain.on("install-packages", (event, arg) => {
    switch (arg) {
        case "check-mkcert": {
            if (!shell.which("mkcert")) {
                shell.echo("Sorry, this script requires git");
                event.reply("install-packages", "mkcert-not-installed");
            } else {
                shell.echo("Mkcert Already Installed");
                event.reply("install-packages", "mkcert-already-installed");
            }
            break;
        }
        default:
            break;
    }
});
