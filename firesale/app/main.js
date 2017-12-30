const { app, BrowserWindow } = require('electron');

// Define variable so it is not garbage collected after `app.on` returns.
let mainWindow = null;

function whenAppReady() {
  mainWindow = new BrowserWindow();
  
  mainWindow.loadURL(`file://$(__dirname)/index.html`);
  
  // Allows `mainWindow` to be garbage collected.
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.on('ready', whenAppReady);
