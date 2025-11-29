const formModule = (function() {
  const form = document.querySelector('.img-upload__form');
  const fileInput = document.querySelector('.img-upload__input');
  const overlay = document.querySelector('.img-upload__overlay');
  const cancelButton = document.querySelector('.img-upload__cancel');
  const hashtagInput = form.querySelector('.text__hashtags');
  const commentInput = form.querySelector('.text__description');

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
      return true; // Пустое поле допустимо
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
  };

  const resetForm = () => {
    form.reset();
    pristine.reset();
    fileInput.value = '';
  };

  const onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape') {
      if (document.activeElement === hashtagInput || document.activeElement === commentInput) {
        return;
      }
      evt.preventDefault();
      closeForm();
    }
  };

  const onFormSubmit = (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();

    if (!isValid) {
      hashtagInput.focus();
    } else {
      form.submit();
    }
  };

  const init = () => {
    fileInput.addEventListener('change', onFileInputChange);
    cancelButton.addEventListener('click', closeForm);
    form.addEventListener('submit', onFormSubmit);

    hashtagInput.addEventListener('input', () => {
      pristine.validate(hashtagInput);
    });

    commentInput.addEventListener('input', () => {
      pristine.validate(commentInput);
    });
  };

  return {
    init,
    closeForm
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  formModule.init();
});
