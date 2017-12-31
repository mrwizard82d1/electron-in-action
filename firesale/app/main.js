const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const mori = require('mori');

// Define variable so it is not garbage collected after `app.on` returns.
let mainWindow = null;

const readFileContent = pathname => {
  return fs.readFileSync(pathname).toString();
}

const getFileFromUser = () => {
  const files = dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      {
        name: 'Text files',
        extensions: [ 'txt'],
      },
      {
        name: 'Markdown Files',
        extensions: ['md'],
      }],
  });
  
  if (!files) {
    return [];
  }

  return files[0];
};

let importFile = function () {
  const selectedFile = getFileFromUser();
  const selectedFileContent = readFileContent(selectedFile);
  mainWindow.webContents.send('file-opened', selectedFile, selectedFileContent);
};

function whenAppReady() {
  // Hide browser window at first.
  mainWindow = new BrowserWindow({ show: false });
  
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  
  // Create one-time event to show the window once the DOM is ready-to-show.
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    importFile();
  })
  
  // Allows `mainWindow` to be garbage collected.
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.on('ready', whenAppReady);

module.exports = {
  importFile,
};
