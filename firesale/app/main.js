const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const mori = require('mori');

const browserWindows = mori.set();

const readFileContent = pathname => {
  return fs.readFileSync(pathname).toString();
};

const getFileFromUser = (targetWindow) => {
  const files = dialog.showOpenDialog(targetWindow, {
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

const importFileInto = browserWindow => {
  const selectedFile = getFileFromUser(browserWindow);
  const selectedFileContent = readFileContent(selectedFile);
  browserWindow.webContents.send('file-opened', selectedFile, selectedFileContent);
};

const createBrowserWindow = function () {
  // Hide new browser window at first.
  let result = new BrowserWindow({show: false});
  
  result.loadURL(`file://${__dirname}/index.html`);
  
  // Create one-time event to show the window once the DOM is ready-to-show.
  result.once('ready-to-show', () => {
    result.show();
    importFileInto(result);
  });
  
  // Allows `result` to be garbage collected.
  result.on('closed', () => {
    mori.disj(browserWindows, result);
    result = null;
  });
  
  return result;
};

const whenAppReady = () => {
  createBrowserWindow();
};

app.on('ready', whenAppReady);

module.exports = {
  createBrowserWindow,
  importFileInto,
};

