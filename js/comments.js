import { closeForm } from './slider.js';
import { isEscapeKey } from './util.js';
import { uploadData } from './api.js';

const errorMessage = document.querySelector('#error').content.querySelector('.error');
const successMessage = document.querySelector('#success').content.querySelector('.success');
const formUpload = document.querySelector('.img-upload__form');

const closePopup = () => {
  const popup = document.querySelector('.error') || document.querySelector('.success');
  popup.remove();
};

const onEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    closePopup();
  }
};

const onPopupClick = (evt) => {
  if (!evt.target.classList.contains('succes__inner') && !evt.target.classList.contains('error__inner')) {
    evt.preventDefault();
    closePopup();
    document.removeEventListener('keydown', onEscKeydown);
  }
};

const showMessage = (message) => {
  message.addEventListener('click', onPopupClick);
  document.body.appendChild(message);
  document.addEventListener('keydown', onEscKeydown, {once: true});
};

const showErrorMessage = () => {
  const messageFragment = errorMessage.cloneNode(true);
  showMessage(messageFragment);
};

const showSuccesMessage = () => {
  const messageFragment = successMessage.cloneNode(true);
  showMessage(messageFragment);
};

const onSuccess = () => {
  closeForm();
  showSuccesMessage();
};

const onFail = () => {
  showErrorMessage();
};

const onFormUploadSubmit = (evt) => {
  evt.preventDefault();
  uploadData(onSuccess, onFail, 'POST', new FormData(evt.target));
};

formUpload.addEventListener('submit', onFormUploadSubmit);
