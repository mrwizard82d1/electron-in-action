const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');

const getFileFromUser = () => {
  const files = dialog.showOpenDialog({ properties: ['openFile'] });
  
  if (!files) {
    return;
  }
  
  const fileToOpen = files[0];
  const fileContent = fs.readFileSync(fileToOpen).toString();
  
  console.log(fileContent);
};

// Define variable so it is not garbage collected after `app.on` returns.
let mainWindow = null;

function whenAppReady() {
  // Hide browser window at first.
  mainWindow = new BrowserWindow({ show: false });
  
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  
  // Create one-time event to show the window once the DOM is ready-to-show.
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    getFileFromUser();
  })
  
  // Allows `mainWindow` to be garbage collected.
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.on('ready', whenAppReady);
