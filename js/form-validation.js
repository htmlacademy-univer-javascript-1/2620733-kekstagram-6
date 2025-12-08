import { sendData } from './api.js';

const formModule = (function() {
  const form = document.querySelector('.img-upload__form');
  const fileInput = document.querySelector('.img-upload__input');
  const overlay = document.querySelector('.img-upload__overlay');
  const cancelButton = document.querySelector('.img-upload__cancel');
  const hashtagInput = form.querySelector('.text__hashtags');
  const commentInput = form.querySelector('.text__description');
  const submitButton = form.querySelector('.img-upload__submit');
  const effectLevel = document.querySelector('.img-upload__effect-level');

  const pristine = new Pristine(form, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--invalid',
    successClass: 'img-upload__field-wrapper--valid',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'img-upload__error'
  }, true);

  const validateHashtags = (value) => {
    if (value === '') {
      return true;
    }

    const hashtags = value.trim().toLowerCase().split(/\s+/);
    const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;

    if (hashtags.length > 5) {
      return false;
    }

    for (let i = 0; i < hashtags.length; i++) {
      const hashtag = hashtags[i];

      if (!hashtagRegex.test(hashtag)) {
        return false;
      }

      if (hashtags.indexOf(hashtag) !== i) {
        return false;
      }
    }

    return true;
  };

  const getHashtagErrorMessage = () => {
    const value = hashtagInput.value;
    const hashtags = value.trim().toLowerCase().split(/\s+/);

    if (hashtags.length > 5) {
      return 'Не более 5 хэш-тегов';
    }

    if (value !== '' && !/^#[a-zа-яё0-9]{1,19}$/i.test(hashtags[0])) {
      return 'Хэш-тег должен начинаться с #, содержать буквы/цифры и быть от 1 до 20 символов';
    }

    const uniqueHashtags = [...new Set(hashtags)];
    if (uniqueHashtags.length !== hashtags.length) {
      return 'Хэш-теги не должны повторяться';
    }

    return 'Некорректный формат хэш-тегов';
  };

  const validateComment = (value) => {
    return value.length <= 140;
  };

  pristine.addValidator(
    hashtagInput,
    validateHashtags,
    getHashtagErrorMessage
  );

  pristine.addValidator(
    commentInput,
    validateComment,
    'Комментарий не должен превышать 140 символов'
  );

  const showMessage = (type, text) => {
    hideMessage();

    const template = document.querySelector(`#${type}`).content.cloneNode(true);
    const messageElement = template.querySelector(`.${type}`);

    if (text) {
      const title = messageElement.querySelector(`.${type}__title`);
      if (title) {
        title.textContent = text;
      }
    }

    document.body.appendChild(messageElement);

    const closeMessage = () => {
      messageElement.remove();
      document.removeEventListener('keydown', onMessageEscKeydown);
    };

    const onMessageEscKeydown = (evt) => {
      if (evt.key === 'Escape') {
        closeMessage();
      }
    };

    const onMessageClick = (evt) => {
      if (!evt.target.closest(`.${type}__inner`)) {
        closeMessage();
      }
    };

    const closeButton = messageElement.querySelector(`.${type}__button`);
    if (closeButton) {
      closeButton.addEventListener('click', closeMessage);
    }

    messageElement.addEventListener('click', onMessageClick);
    document.addEventListener('keydown', onMessageEscKeydown);
  };

  const hideMessage = () => {
    const existingMessage = document.querySelector('.success, .error');
    if (existingMessage) {
      existingMessage.remove();
    }
  };

  const toggleSubmitButton = (isDisabled) => {
    if (submitButton) {
      submitButton.disabled = isDisabled;
      submitButton.textContent = isDisabled ? 'Публикую...' : 'Опубликовать';
    }
  };

  const resetForm = () => {
    form.reset();
    pristine.reset();

    const preview = document.querySelector('.img-upload__preview img');
    if (preview) {
      preview.src = '';
      preview.style.transform = '';
      preview.style.filter = '';
    }

    const effectNone = document.querySelector('#effect-none');
    if (effectNone) {
      effectNone.checked = true;
    }

    if (effectLevel) {
      effectLevel.classList.add('hidden');
    }

    const scaleControl = document.querySelector('.scale__control--value');
    if (scaleControl) {
      scaleControl.value = '100%';
    }
  };

  const onFormSubmit = async (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();

    if (!isValid) {
      hashtagInput.focus();
      return;
    }

    try {
      toggleSubmitButton(true);

      const formData = new FormData(form);

      await sendData(formData);

      showMessage('success', 'Изображение успешно загружено!');

      closeForm();

    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      showMessage('error', 'Ошибка загрузки файла. Попробуйте ещё раз.');

      toggleSubmitButton(false);
    }
  };

  const onFileInputChange = () => {
    openForm();
  };

  const openForm = () => {
    overlay.classList.remove('hidden');
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', onDocumentKeydown);
  };

  const closeForm = () => {
    overlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onDocumentKeydown);
    resetForm();
    toggleSubmitButton(false);
  };

  const onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape') {
      if (document.activeElement === hashtagInput ||
          document.activeElement === commentInput ||
          document.querySelector('.success, .error')) {
        return;
      }
      evt.preventDefault();
      closeForm();
    }
  };

  const init = () => {
    if (!form) return;

    fileInput.addEventListener('change', onFileInputChange);
    cancelButton.addEventListener('click', closeForm);
    form.addEventListener('submit', onFormSubmit);

    hashtagInput.addEventListener('input', () => {
      pristine.validate(hashtagInput);
    });

    commentInput.addEventListener('input', () => {
      pristine.validate(commentInput);
    });

    const resetButton = form.querySelector('.img-upload__cancel, [type="reset"]');
    if (resetButton && resetButton !== cancelButton) {
      resetButton.addEventListener('click', resetForm);
    }
  };

  return {
    init,
    closeForm,
    resetForm
  };
})();

export default formModule;
