const { remote, ipcRenderer } = require('electron');
const marked = require('marked');
const mori = require('mori');
const path = require('path');
const { createBrowserWindow, importFileInto } = remote.require('./main.js');

const currentWindow = remote.getCurrentWindow();
let filePath = null;
let originalContent = '';

const selectors = ['#markdown', '#html', '#new-file', '#open-file', '#save-markdown', '#revert',
                   '#save-file', '#show-file', '#open-in-default'];
const [markdownView, htmlView, newFileButton, openFileButton, saveMarkdownButton, revertButton,
  saveHtmlButton, showFileButton, openInDefaultButton] =
  mori.toJs(mori.map(s => document.querySelector(s), selectors));

const renderMarkdownToHtml = (markdown) => {
  htmlView.innerHTML = marked(markdown, { sanitize: true });
};

markdownView.addEventListener('keyup', event => {
  renderMarkdownToHtml(event.target.value);
  updateUserInterface(event.target.value !== originalContent);
});

openFileButton.addEventListener('click', () => importFileInto(currentWindow));

newFileButton.addEventListener('click', () => createBrowserWindow());

const updateUserInterface = isEdited => {
  let title = 'Fire Sale!';
  if (filePath) {
    title = `${path.basename(filePath)} - ${title}`;
  }
  
  if (isEdited) {
    title = `${title} (Edited)`;
  }
  
  currentWindow.setTitle(title);
  currentWindow.setDocumentEdited(isEdited);
};

ipcRenderer.on('file-opened', (event, selectedFile, selectedFileContent) => {
  filePath = selectedFile;
  originalContent = selectedFileContent;
  
  markdownView.value = selectedFileContent;
  renderMarkdownToHtml(selectedFileContent);
  
  updateUserInterface(false);
});
