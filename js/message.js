const successMessageTemplate = document.querySelector('#success').content.querySelector('.success');
const errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');

const closeMessageModal = (messageElement, closeCallback) => {
  messageElement.remove();
  document.removeEventListener('keydown', closeCallback);
  document.removeEventListener('click', closeCallback);
};

const createMessageModal = (template, closeButtonSelector) => {
  const messageElement = template.cloneNode(true);
  const closeButton = messageElement.querySelector(closeButtonSelector);
  messageElement.style.zIndex = '100';
  document.body.append(messageElement);
  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMessageModal(messageElement, onKeyDown);
    }
  };
  const onClick = (event) => {
    if (event.target === messageElement || event.target === closeButton) {
      closeMessageModal(messageElement, onKeyDown);
    }
  };
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('click', onClick);
};

const displaySuccessMessage = () => {
  createMessageModal(successMessageTemplate, '.success__button');
};

const displayErrorMessage = () => {
  createMessageModal(errorMessageTemplate, '.error__button');
};

export { displaySuccessMessage, displayErrorMessage };
