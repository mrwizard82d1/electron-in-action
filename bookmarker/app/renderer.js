const _ = require('mori');

const selectors = ['.links', '.error-message', '.new-link-form', '.new-link-url',
                   '.new-link-submit', 'clear-storage'];
const [linksSection, errorMessage, newLinkForm, newLinkUrl, newLinkSubmit, clearStorageButton] =
  _.toJs(_.map(s => document.querySelector(s), selectors));

newLinkUrl.addEventListener('keyup', () => {
  newLinkSubmit.disabled = !newLinkUrl.validity.valid;
});

const parser = new DOMParser();

const clearForm = () => {
  newLinkUrl.value = null;
};

function appendMessage(text) {
  document.querySelector('#messages').value += `\n${text.toString()}`;
}

function parseResponse(text) {
  return parser.parseFromString(text, 'text/html');
}

function findTitle(domNodes) {
  return domNodes.querySelector('title').innerText;
}

function storeUrl(title, url) {
  localStorage.setItem(url, JSON.stringify({
    title,
    url,
  }));
}

function dumpLocalStorage() {
  for(var i = 0; i < localStorage.length; i++) {
    const url = localStorage.key(i);
    const title = JSON.parse(localStorage.getItem(url)).title;
    appendMessage(`${url}: ${title}`);
  }
}

function handleSubmit(event) {
  event.preventDefault();
  
  const newUrl = newLinkUrl.value;
  
  fetch(newUrl)
    .then(response => response.text())
    .then(text => {
      _.pipeline(text, parseResponse, findTitle, _.curry(storeUrl, newUrl));
      clearForm();
      dumpLocalStorage();
    })
    .catch(e => appendMessage(`Error, ${e}, fetching url, ${newUrl} )`));
}

newLinkForm.addEventListener('submit', handleSubmit);