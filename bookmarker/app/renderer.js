// Instantiate the parser once.
const parser = new DOMParser();

// And cache some DOM elements.
const linkSection = document.querySelector('.links');
const errorMessag = document.querySelector('.error-message');
const newLinkForm = document.querySelector('.new-link-form');
const newLinkUrl = document.querySelector('.new-link-url');
const newLinkSubmit = document.querySelector('.new-link-submit');
const clearStorageButton = document.querySelector('.clear-storage');

// I know the author recommended the previous caching; however, I'm uncertain if it is necessary. The author has more
// concrete experience. I am less clear but I defer to the author.

// The class `new-link-url` is of type `url`. If we were running in a browser like Chrome or Firefox, we would have
// access to built-in, error message pop-ups. In electron, we **do not** have access to these features. To indicate to
// the user that she has entered a valid URL, we will use the enabled/disabled state of the submit button (class
// `new-link-submit`). If the URL is valid, we will enable the button. If it is not valid, we will disable the button.
newLinkUrl.addEventListener('keyup', () => {
  newLinkSubmit.disabled = !newLinkUrl.validity.valid;
});

// Helper function to clear the new URL.
function clearForm() {
  newLinkUrl.value = null;
}

// A helper function to parse the response to our request.
function parseResponse(text) {
  return parser.parseFromString(text, 'text/html');
}

// A helper function to find the title in a document.
function findTitle(nodes) {
  return nodes.querySelector('title').innerText;
}

// A helper function to store the title and its link.
function storeLink(title, url) {
  localStorage.setItem(url, JSON.stringify({title: title, url: url}));
}

// A helper function to retrieve all the links from local storage.
function getLinks() {
  return Object.keys(localStorage)
                .map(key => JSON.parse(localStorage[key]));
}

// A helper function to convert links to HTML elements.
// Be careful: this function **does not** sanitize its values so you could "script inject" yourself!
function convertToElement(link) {
  return `<div class="link"><h3>${link.title}</h3><p><a href="${link.url}">${link.url}</a></p></div>`;
}

// A helper function to render all the links in the `linksSection` of the document.
function renderLinks() {
  const linkElements = getLinks().map(convertToElement).join('');
  linkSection.innerHTML = linkElements;
}

// We handle the form submission ourselves. (This is an electron application, after all. :) )
newLinkForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const url = newLinkUrl.value;
  fetch(url)
    .then(response => response.text())
    .then(parseResponse)
    .then(findTitle)
    .then(title => storeLink(title, url))
    .then(clearForm)
    .then(renderLinks);
});

// wire up the clearstorage button.
clearStorageButton.addEventListener('click', function clearStorage() {
  localStorage.clear();
  linkSection.innerHTML = '';
});

renderLinks();
