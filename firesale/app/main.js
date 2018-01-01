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
  // Position of newly created window. Use `undefined` for both to use default position.
  let x, y;
  const currentWindow = BrowserWindow.getFocusedWindow();
  if (currentWindow) {
    const [currentWindowX, currentWindowY] = currentWindow.getPosition();
    x = currentWindowX + 13;
    y = currentWindowY + 13;
  }
  
  // Hide new browser window at first.
  let result = new BrowserWindow({x, y, show: false});
  
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

const isMacOsX = () => {
  return process.platform === 'darwin';
};

const whenAllClosed = () => {
  if (isMacOsX()) {
    // Does *not* close application when all windows are closed. (Standard Mac OS X behavior.)
    return false;
  }
};

app.on('window-all-closed', whenAllClosed);

module.exports = {
  createBrowserWindow,
  importFileInto,
};

