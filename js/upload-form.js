import { restoreImageScale } from './scale-editor.js';
import { restoreDefaultEffect } from './picture-effects.js';
import { uploadPhoto } from './api.js';
import { displaySuccessMessage, displayErrorMessage } from './message.js';
import { loadSelectedImage } from './image-preview.js';

const MAX_HASHTAGS = 5;
const COMMENT_MAX_LENGTH = 140;
const HASHTAG_PATTERN = /^#[a-zа-яё0-9]{1,19}$/i;

const imageUploadForm = document.querySelector('.img-upload__form');
const formOverlay = document.querySelector('.img-upload__overlay');
const pageBody = document.querySelector('body');
const cancelButton = document.querySelector('#upload-cancel');
const imageFileInput = document.querySelector('#upload-file');
const hashtagsInput = document.querySelector('.text__hashtags');
const commentInput = document.querySelector('.text__description');
const submitFormButton = document.querySelector('#upload-submit');

const SubmitButtonState = {
  DEFAULT: 'Опубликовать',
  PROCESSING: 'Публикую...'
};

const pristineValidator = new window.Pristine(imageUploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error',
});

const splitHashtags = (inputString) => inputString.trim().split(/\s+/).filter(Boolean);

const validateHashtagFormat = (value) => {
  if (!value.trim()) {
    return true;
  }
  const tags = splitHashtags(value);
  return tags.every((tag) => HASHTAG_PATTERN.test(tag));
};
pristineValidator.addValidator(hashtagsInput, validateHashtagFormat, 'Некорректный хэш-тег. Используйте #, буквы и цифры (макс. 20 символов).', 2, false);

const validateHashtagCount = (value) => {
  const tags = splitHashtags(value);
  return tags.length <= MAX_HASHTAGS;
};
pristineValidator.addValidator(hashtagsInput, validateHashtagCount, `Не более ${MAX_HASHTAGS} хэш-тегов.`, 1, false);

const validateHashtagUniqueness = (value) => {
  const tags = splitHashtags(value);
  const lowerCaseTags = tags.map((tag) => tag.toLowerCase());
  return new Set(lowerCaseTags).size === lowerCaseTags.length;
};
pristineValidator.addValidator(hashtagsInput, validateHashtagUniqueness, 'Хэш-теги не должны повторяться.', 3, false);

const validateCommentLength = (value) => value.length <= COMMENT_MAX_LENGTH;
pristineValidator.addValidator(commentInput, validateCommentLength, `Комментарий не может превышать ${COMMENT_MAX_LENGTH} символов.`, 1, false);

const showForm = () => {
  formOverlay.classList.remove('hidden');
  pageBody.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeyDown);
};

const hideForm = () => {
  imageUploadForm.reset();
  pristineValidator.reset();
  restoreImageScale();
  restoreDefaultEffect();
  formOverlay.classList.add('hidden');
  pageBody.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeyDown);
};

const toggleSubmitButton = (isActive = false) => {
  submitFormButton.disabled = isActive;
  submitFormButton.textContent = isActive ? SubmitButtonState.PROCESSING : SubmitButtonState.DEFAULT;
};

const onFileSelect = () => {
  loadSelectedImage();
  showForm();
};

const onCancelClick = () => hideForm();

const onDocumentKeyDown = (event) => {
  if (event.key === 'Escape') {
    const isErrorPopupOpen = document.querySelector('.error');
    const isFocusedOnTextInput = [hashtagsInput, commentInput].includes(document.activeElement);
    if (isErrorPopupOpen || isFocusedOnTextInput) {
      return;
    }
    event.preventDefault();
    hideForm();
  }
};

const onFormSubmit = (event) => {
  event.preventDefault();
  const isFormValid = pristineValidator.validate();
  if (!isFormValid) {
    return;
  }
  toggleSubmitButton(true);
  const formDataToSend = new FormData(event.target);
  uploadPhoto(formDataToSend)
    .then(() => {
      hideForm();
      displaySuccessMessage();
    })
    .catch(() => {
      displayErrorMessage();
    })
    .finally(() => {
      toggleSubmitButton(false);
    });
};

const initializeUploadForm = () => {
  imageFileInput.addEventListener('change', onFileSelect);
  cancelButton.addEventListener('click', onCancelClick);
  imageUploadForm.addEventListener('submit', onFormSubmit);
};

export { initializeUploadForm };
