const { app, BrowserWindow } = require('electron');

// Define variable outside `app.on` callback so it does not go out of scope before we render it.
let mainWindow = null;

app.on('ready', () => {
  console.log('Hello from Electron!');
  mainWindow = new BrowserWindow();
  mainWindow.webContents.loadURL(`file://${__dirname}/index.html`);
});
