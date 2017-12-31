const { remote } = require('electron');
const marked = require('marked');
const mori = require('mori');
const { readSelectedFileContent } = remote.require('./main.js');

const selectors = ['#markdown', '#html', '#new-file', '#open-file', '#save-markdown', '#revert',
                   '#save-file', '#show-file', '#open-in-default'];
const [markdownView, htmlView, newFileButton, openFileButton, saveMarkdownButton, revertButton,
  saveHtmlButton, showFileButton, openInDefaultButton] =
  mori.toJs(mori.map(s => document.querySelector(s), selectors));

const renderMarkdownToHtml = (markdown) => {
  htmlView.innerHTML = marked(markdown, { sanitize: true });
};

markdownView.addEventListener('keyup', event => renderMarkdownToHtml(event.target.value));

openFileButton.addEventListener('click', () => {
  const selectedFileContent = readSelectedFileContent();
  console.log(selectedFileContent);
});
