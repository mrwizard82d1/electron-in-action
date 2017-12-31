const { app, BrowserWindow, dialog } = require('electron');

const getFileFromUser = () => {
  const files = dialog.showOpenDialog({ properties: ['openFile'] });
  
  if (!files) {
    return;
  }
  
  console.log(files);
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
