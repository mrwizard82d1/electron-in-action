const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const mori = require('mori');

const readFileContent = pathname => {
  return fs.readFileSync(pathname).toString();
}

const getFileFromUser = () => {
  debugger;
  const files = dialog.showOpenDialog({ properties: ['openFile'] });
  
  if (!files) {
    return [];
  }

  return files[0];
};

const logSelectedFileContent = () => mori.pipeline(getFileFromUser(), readFileContent, console.log);

// Define variable so it is not garbage collected after `app.on` returns.
let mainWindow = null;

function whenAppReady() {
  // Hide browser window at first.
  mainWindow = new BrowserWindow({ show: false });
  
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  
  // Create one-time event to show the window once the DOM is ready-to-show.
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  
    debugger;
    logSelectedFileContent();
  })
  
  // Allows `mainWindow` to be garbage collected.
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.on('ready', whenAppReady);
