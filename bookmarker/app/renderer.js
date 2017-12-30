const _ = require('mori');
const { shell } = require('electron');

const selectors = ['.links', '.error-message', '.new-link-form', '.new-link-url',
                   '.new-link-submit', '.clear-storage'];
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

function getLinks() {
  const result = _.map(k => _.pipeline(k,
    Storage.prototype.getItem.bind(localStorage), JSON.parse), Object.keys(localStorage));
  return result;
}

function convertToElement(link) {
  return `<div class="link"><h3>${link.title}</h3><p><a href="${link.url}">${link.url}</a></p></div>`;
}

function renderLinks() {
  let html = (_.intoArray(_.map(convertToElement, getLinks()))).join('');
  linksSection.innerHTML = html;
}

function validateResponse(response) {
  if (response.ok) {
    return response;
  }
  
  throw new Error(`Unexpected status code of ${response.status}, ${response.statusText}.`);
}

function handleSubmit(event) {
  event.preventDefault();
  
  const newUrl = newLinkUrl.value;
  
  fetch(newUrl)
    .then(validateResponse)
    .then(response => response.text())
    .then(text => {
      _.pipeline(text, parseResponse, findTitle, _.curry(storeUrl, newUrl));
      clearForm();
      renderLinks();
    })
    .catch(e => temporarilyDisplayError(e, newUrl));
}

// Render whatever links are currently stored in local storage.
renderLinks();

// Listen for the addition of new links.
newLinkForm.addEventListener('submit', handleSubmit);

function clearStorage() {
  localStorage.clear();
  linksSection.innerHTML = '';
}

// Clear out old links when requested.
clearStorageButton.addEventListener('click', clearStorage);

function temporarilyDisplayError(error, url) {
  // Display the error message
  errorMessage.innerHTML = `Sorry. I could not add the URL, "${url}".<br/>` +
                           'Would you mind checking it?<br/><br/>' +
                           `The technical details are: ${error}.`;
  // Erase the message after 10 seconds
  setTimeout(() => errorMessage.innerHTML = '', 10000);
}

// Open added links in external browser
function openLinkInBrowser(event) {
  if (event.target.href) {
    event.preventDefault();
    shell.openExternal(event.target.href);
  }
}

linksSection.addEventListener('click', openLinkInBrowser);
