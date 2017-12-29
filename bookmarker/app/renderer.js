const _ = require('mori');

const selectors = ['.links', '.error-message', '.new-link-form', '.new-link-url',
                   '.new-link-submit', 'clear-storage'];
const [linksSection, errorMessage, newLinkForm, newLinkUrl, newLinkSubmit, clearStorageButton] =
  _.toJs(_.map(s => document.querySelector(s), selectors));

newLinkUrl.addEventListener('keyup', () => {
  newLinkSubmit.disabled = !newLinkUrl.validity.valid;
});

const clearForm = () => {
  newLinkUrl.value = null;
};

function appendMessage(text) {
  document.querySelector('#messages').value += `\n${text.toString()}`;
}

function handleSubmit(event) {
  appendMessage('In `handleSubmit`');
  event.preventDefault();
  
  const newUrl = newLinkUrl.value;
  appendMessage(`newUrl === ${newUrl}`);
  
  fetch(newUrl)
    .then(response => response.text())
    .then(text => appendMessage((_.toJs(_.subvec(_.seq(text), 0, 100))).join('')))
    .catch(e => appendMessage(`Error, ${e}, fetching url, ${newUrl} )`));
}

newLinkForm.addEventListener('submit', handleSubmit);