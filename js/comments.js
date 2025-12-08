const successTemplate = document.querySelector('#success').content.querySelector('.success');
const errorTemplate = document.querySelector('#error').content.querySelector('.error');

function showMessage(template, closeButtonClass) {
  const messageElement = template.cloneNode(true);
  const closeButton = messageElement.querySelector(closeButtonClass);
  messageElement.style.zIndex = '100';

  document.body.append(messageElement);

  function closeMessage() {
    messageElement.remove();
    document.removeEventListener('keydown', onDocumentKeydown);
    document.removeEventListener('click', onDocumentClick);
  }

  function onDocumentKeydown(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeMessage();
    }
  }

  function onDocumentClick(evt) {
    if (evt.target === messageElement) {
      closeMessage();
    }
  }

  closeButton.addEventListener('click', closeMessage);
  document.addEventListener('keydown', onDocumentKeydown);
  document.addEventListener('click', onDocumentClick);
}

function showSuccessMessage() {
  showMessage(successTemplate, '.success__button');
}

function showErrorMessage() {
  showMessage(errorTemplate, '.error__button');
}

export { showSuccessMessage, showErrorMessage };
