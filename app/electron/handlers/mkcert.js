const { ipcMain } = require("electron");
ipcMain.on("install-packages", (event, arg) => {
    console.log(arg); // prints "ping"
    event.reply("install-packages", "mkcert-success");
});
