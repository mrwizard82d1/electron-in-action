const linkSection = document.querySelector('.links');
const errorMessag = document.querySelector('.error-message');
const newLinkForm = document.querySelector('.new-link-form');
const newLinkUrl = document.querySelector('.new-link-url');
const newLinkSubmit = document.querySelector('.new-link-submit');
const clearStorageButton = document.querySelector('.clear-storage');

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
