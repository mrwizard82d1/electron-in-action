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

