'use strict';

import { sendData } from './api.js';
import { initImageLoader, resetUploadedImage } from './image-loader.js';
import imageEditor from './image-editor.js';

const MAX_HASHTAGS_COUNT = 5;
const MAX_HASHTAG_LENGTH = 20;
const MAX_COMMENT_LENGTH = 140;
const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;
const KEY_ESCAPE = 'Escape';

const createFormModule = () => {
  const formElement = document.querySelector('.img-upload__form');
  const fileInputElement = document.querySelector('.img-upload__input');
  const overlayElement = document.querySelector('.img-upload__overlay');
  const cancelButtonElement = document.querySelector('.img-upload__cancel');
  const hashtagInputElement = formElement ? formElement.querySelector('.text__hashtags') : null;
  const commentInputElement = formElement ? formElement.querySelector('.text__description') : null;
  const submitButtonElement = formElement ? formElement.querySelector('.img-upload__submit') : null;

  let pristine = null;

  const initializePristine = () => {
    if (!formElement || typeof window.Pristine === 'undefined') {
      return null;
    }

    return new window.Pristine(formElement, {
      classTo: 'img-upload__field-wrapper',
      errorClass: 'img-upload__field-wrapper--invalid',
      successClass: 'img-upload__field-wrapper--valid',
      errorTextParent: 'img-upload__field-wrapper',
      errorTextTag: 'div',
      errorTextClass: 'img-upload__error'
    }, true);
  };

  const validateHashtags = (value) => {
    if (typeof value !== 'string') {
      return false;
    }

    const trimmedValue = value.trim();
    if (trimmedValue === '') {
      return true;
    }

    const hashtags = trimmedValue.toLowerCase().split(/\s+/);

    if (hashtags.length > MAX_HASHTAGS_COUNT) {
      return false;
    }

    const uniqueHashtags = new Set();

    for (let i = 0; i < hashtags.length; i++) {
      const hashtag = hashtags[i];

      if (!HASHTAG_REGEX.test(hashtag)) {
        return false;
      }

      if (uniqueHashtags.has(hashtag)) {
        return false;
      }

      uniqueHashtags.add(hashtag);
    }

    return true;
  };

  const getHashtagErrorMessage = () => {
    if (!hashtagInputElement) {
      return 'Некорректный формат хэш-тегов';
    }

    const value = hashtagInputElement.value.trim();
    if (value === '') {
      return '';
    }

    const hashtags = value.toLowerCase().split(/\s+/);

    if (hashtags.length > MAX_HASHTAGS_COUNT) {
      return `Не более ${MAX_HASHTAGS_COUNT} хэш-тегов`;
    }

    for (let i = 0; i < hashtags.length; i++) {
      if (!HASHTAG_REGEX.test(hashtags[i])) {
        return `Хэш-тег должен начинаться с #, содержать буквы/цифры и быть от 1 до ${MAX_HASHTAG_LENGTH} символов`;
      }
    }

    const uniqueHashtags = new Set(hashtags);
    if (uniqueHashtags.size !== hashtags.length) {
      return 'Хэш-теги не должны повторяться';
    }

    return 'Некорректный формат хэш-тегов';
  };

  const validateComment = (value) => {
    return typeof value === 'string' && value.length <= MAX_COMMENT_LENGTH;
  };

  const addPristineValidators = () => {
    if (!pristine) {
      return;
    }

    if (hashtagInputElement) {
      pristine.addValidator(
        hashtagInputElement,
        validateHashtags,
        getHashtagErrorMessage
      );
    }

    if (commentInputElement) {
      pristine.addValidator(
        commentInputElement,
        validateComment,
        `Комментарий не должен превышать ${MAX_COMMENT_LENGTH} символов`
      );
    }
  };

  const onFileInputChange = () => {
    if (!fileInputElement || !fileInputElement.files) {
      return;
    }

    const file = fileInputElement.files[0];
    if (!file) {
      return;
    }

    if (typeof imageEditor?.init === 'function') {
      imageEditor.init();
    }

    openForm();
  };

  const openForm = () => {
    if (overlayElement) {
      overlayElement.classList.remove('hidden');
    }

    document.body.classList.add('modal-open');
    document.addEventListener('keydown', onDocumentKeydown);
  };

  const closeForm = () => {
    if (overlayElement) {
      overlayElement.classList.add('hidden');
    }

    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onDocumentKeydown);
    resetForm();
  };

  const resetForm = () => {
    if (formElement) {
      formElement.reset();
    }

    if (pristine) {
      pristine.reset();
    }

    resetUploadedImage();

    if (typeof imageEditor?.reset === 'function') {
      imageEditor.reset();
    }

    if (submitButtonElement) {
      submitButtonElement.disabled = false;
      submitButtonElement.textContent = 'Опубликовать';
    }
  };

  const onDocumentKeydown = (evt) => {
    if (evt.key !== KEY_ESCAPE) {
      return;
    }

    const activeElement = document.activeElement;
    const hasMessageOpen = document.querySelector('.success, .error') !== null;

    if (activeElement === hashtagInputElement ||
        activeElement === commentInputElement ||
        hasMessageOpen) {
      return;
    }

    evt.preventDefault();
    closeForm();
  };

  const showMessage = (type, text) => {
    const existingMessage = document.querySelector('.success, .error');
    if (existingMessage) {
      existingMessage.remove();
    }

    const template = document.querySelector(`#${type}`);
    if (!template || !template.content) {
      return;
    }

    const messageElement = template.content.cloneNode(true).firstElementChild;
    if (!messageElement) {
      return;
    }

    if (typeof text === 'string' && text.length > 0) {
      const titleElement = messageElement.querySelector(`.${type}__title`);
      if (titleElement) {
        titleElement.textContent = text;
      }
    }

    document.body.appendChild(messageElement);

    const closeMessage = () => {
      if (messageElement.parentNode) {
        messageElement.remove();
      }
      document.removeEventListener('keydown', onMessageEscKeydown);
    };

    const onMessageEscKeydown = (evt) => {
      if (evt.key === KEY_ESCAPE) {
        closeMessage();
      }
    };

    const closeButton = messageElement.querySelector(`.${type}__button`);
    if (closeButton) {
      closeButton.addEventListener('click', closeMessage);
    }

    messageElement.addEventListener('click', (evt) => {
      if (!evt.target.closest(`.${type}__inner`)) {
        closeMessage();
      }
    });

    document.addEventListener('keydown', onMessageEscKeydown);
  };

  const toggleSubmitButton = (isDisabled) => {
    if (!submitButtonElement) {
      return;
    }

    submitButtonElement.disabled = isDisabled;
    submitButtonElement.textContent = isDisabled ? 'Публикую...' : 'Опубликовать';
  };

  const onFormSubmit = async (evt) => {
    evt.preventDefault();

    if (!pristine) {
      return;
    }

    const isValid = pristine.validate();
    if (!isValid) {
      if (hashtagInputElement) {
        hashtagInputElement.focus();
      }
      return;
    }

    try {
      toggleSubmitButton(true);

      const formData = new FormData(formElement);
      await sendData(formData);

      showMessage('success', 'Изображение успешно загружено!');
      closeForm();

    } catch (error) {
      showMessage('error', 'Ошибка загрузки файла. Попробуйте ещё раз.');
      toggleSubmitButton(false);
    }
  };

  const onHashtagInput = () => {
    if (pristine && hashtagInputElement) {
      pristine.validate(hashtagInputElement);
    }
  };

  const onCommentInput = () => {
    if (pristine && commentInputElement) {
      pristine.validate(commentInputElement);
    }
  };

  const onInputKeydown = (evt) => {
    if (evt.key === KEY_ESCAPE) {
      evt.stopPropagation();
    }
  };

  const init = () => {
    if (!formElement) {
      return;
    }

    pristine = initializePristine();
    if (!pristine) {
      return;
    }

    addPristineValidators();

    initImageLoader();

    if (typeof imageEditor?.init === 'function') {
      imageEditor.init();
    }

    if (fileInputElement) {
      fileInputElement.addEventListener('change', onFileInputChange);
    }

    if (cancelButtonElement) {
      cancelButtonElement.addEventListener('click', closeForm);
    }

    formElement.addEventListener('submit', onFormSubmit);

    if (hashtagInputElement) {
      hashtagInputElement.addEventListener('input', onHashtagInput);
      hashtagInputElement.addEventListener('keydown', onInputKeydown);
    }

    if (commentInputElement) {
      commentInputElement.addEventListener('input', onCommentInput);
      commentInputElement.addEventListener('keydown', onInputKeydown);
    }

    const resetButton = formElement.querySelector('[type="reset"]');
    if (resetButton) {
      resetButton.addEventListener('click', resetForm);
    }
  };

  const destroy = () => {
    if (fileInputElement) {
      fileInputElement.removeEventListener('change', onFileInputChange);
    }

    if (cancelButtonElement) {
      cancelButtonElement.removeEventListener('click', closeForm);
    }

    if (formElement) {
      formElement.removeEventListener('submit', onFormSubmit);
    }

    if (hashtagInputElement) {
      hashtagInputElement.removeEventListener('input', onHashtagInput);
      hashtagInputElement.removeEventListener('keydown', onInputKeydown);
    }

    if (commentInputElement) {
      commentInputElement.removeEventListener('input', onCommentInput);
      commentInputElement.removeEventListener('keydown', onInputKeydown);
    }

    const resetButton = formElement ? formElement.querySelector('[type="reset"]') : null;
    if (resetButton) {
      resetButton.removeEventListener('click', resetForm);
    }

    document.removeEventListener('keydown', onDocumentKeydown);

    const existingMessage = document.querySelector('.success, .error');
    if (existingMessage) {
      existingMessage.remove();
    }
  };

  return {
    init,
    closeForm,
    resetForm,
    destroy
  };
};

const formModule = createFormModule();

export default formModule;
