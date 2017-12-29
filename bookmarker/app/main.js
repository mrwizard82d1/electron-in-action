const { app, BrowserWindow } = require('electron');

// Define `mainWindow` outside `app.on` callback so it does not go out of scope before we try to
// render it.
let mainWindow = null;

app.on('ready', () => {
  console.log('Hello from Electron!');
  mainWindow = new BrowserWindow();
});
