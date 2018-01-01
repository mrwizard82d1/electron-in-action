const { remote, ipcRenderer } = require('electron');
const marked = require('marked');
const mori = require('mori');
const { createBrowserWindow, importFileInto } = remote.require('./main.js');

const currentWindow = remote.getCurrentWindow();

const selectors = ['#markdown', '#html', '#new-file', '#open-file', '#save-markdown', '#revert',
                   '#save-file', '#show-file', '#open-in-default'];
const [markdownView, htmlView, newFileButton, openFileButton, saveMarkdownButton, revertButton,
  saveHtmlButton, showFileButton, openInDefaultButton] =
  mori.toJs(mori.map(s => document.querySelector(s), selectors));

const renderMarkdownToHtml = (markdown) => {
  htmlView.innerHTML = marked(markdown, { sanitize: true });
};

markdownView.addEventListener('keyup', event => renderMarkdownToHtml(event.target.value));

openFileButton.addEventListener('click', () => importFileInto(currentWindow));

newFileButton.addEventListener('click', () => createBrowserWindow());

ipcRenderer.on('file-opened', (event, selectedFile, selectedFileContent) => {
  markdownView.value = selectedFileContent;
  renderMarkdownToHtml(selectedFileContent);
});
