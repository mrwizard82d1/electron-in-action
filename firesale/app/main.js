const { app, BrowserWindow } = require('electron');

// Define variable so it is not garbage collected after `app.on` returns.
let mainWindow = null;

function whenAppReady() {
  // Hide browser window at first.
  mainWindow = new BrowserWindow({ show: false });
  
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  
  // Create one-time event to show the window once the DOM is ready-to-show.
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  })
  
  // Open the developer tools programatically.
  mainWindow.webContents.openDevTools();
  
  // Allows `mainWindow` to be garbage collected.
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.on('ready', whenAppReady);
