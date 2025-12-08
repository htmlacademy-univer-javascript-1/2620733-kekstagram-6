// form-validation.js
import { sendData } from './api.js';
import { initImageLoader, resetUploadedImage } from './image-loader.js';
import imageEditor from './image-editor.js';

const formModule = (function() {
  const form = document.querySelector('.img-upload__form');
  const fileInput = document.querySelector('.img-upload__input');
  const overlay = document.querySelector('.img-upload__overlay');
  const cancelButton = document.querySelector('.img-upload__cancel');
  const hashtagInput = form?.querySelector('.text__hashtags');
  const commentInput = form?.querySelector('.text__description');
  const submitButton = form?.querySelector('.img-upload__submit');

  // Инициализация Pristine только если форма существует
  let pristine;
  if (form) {
    pristine = new Pristine(form, {
      classTo: 'img-upload__field-wrapper',
      errorClass: 'img-upload__field-wrapper--invalid',
      successClass: 'img-upload__field-wrapper--valid',
      errorTextParent: 'img-upload__field-wrapper',
      errorTextTag: 'div',
      errorTextClass: 'img-upload__error'
    }, true);
  }

  // Функции валидации хэштегов
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
    if (!hashtagInput) return 'Некорректный формат хэш-тегов';

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

  // Функция валидации комментария
  const validateComment = (value) => {
    return value.length <= 140;
  };

  // Добавление валидаторов к Pristine
  if (pristine && hashtagInput) {
    pristine.addValidator(
      hashtagInput,
      validateHashtags,
      getHashtagErrorMessage
    );
  }

  if (pristine && commentInput) {
    pristine.addValidator(
      commentInput,
      validateComment,
      'Комментарий не должен превышать 140 символов'
    );
  }

  // Обработчик изменения файла
  const onFileInputChange = () => {
    if (!fileInput) return;

    const file = fileInput.files[0];

    if (file) {
      // Инициализируем редактор если нужно
      if (typeof imageEditor?.init === 'function') {
        imageEditor.init();
      }

      // Показываем форму
      openForm();
    }
  };

  const openForm = () => {
    if (overlay) {
      overlay.classList.remove('hidden');
    }
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', onDocumentKeydown);
  };

  const closeForm = () => {
    if (overlay) {
      overlay.classList.add('hidden');
    }
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onDocumentKeydown);
    resetForm();
  };

  const resetForm = () => {
    if (form) {
      form.reset();
    }

    if (pristine) {
      pristine.reset();
    }

    resetUploadedImage();

    if (typeof imageEditor?.reset === 'function') {
      imageEditor.reset();
    }

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Опубликовать';
    }
  };

  const onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape') {
      // Проверяем, не в фокусе ли поля ввода
      const activeElement = document.activeElement;
      if (activeElement === hashtagInput ||
          activeElement === commentInput ||
          document.querySelector('.success, .error')) {
        return;
      }
      evt.preventDefault();
      closeForm();
    }
  };

  // Функции для сообщений
  const showMessage = (type, text) => {
    // Удаляем предыдущие сообщения
    hideMessage();

    const template = document.querySelector(`#${type}`);
    if (!template) {
      console.error(`Шаблон #${type} не найден`);
      return;
    }

    const messageElement = template.content.cloneNode(true).firstElementChild;

    if (text && messageElement) {
      const title = messageElement.querySelector(`.${type}__title`);
      if (title) {
        title.textContent = text;
      }
    }

    document.body.appendChild(messageElement);

    // Закрытие сообщения
    const closeMessage = () => {
      messageElement.remove();
      document.removeEventListener('keydown', onMessageEscKeydown);
    };

    const onMessageEscKeydown = (evt) => {
      if (evt.key === 'Escape') {
        closeMessage();
      }
    };

    const closeButton = messageElement.querySelector(`.${type}__button`);
    if (closeButton) {
      closeButton.addEventListener('click', closeMessage);
    }

    messageElement.addEventListener('click', (evt) => {
      if (messageElement && !evt.target.closest(`.${type}__inner`)) {
        closeMessage();
      }
    });

    document.addEventListener('keydown', onMessageEscKeydown);
  };

  const hideMessage = () => {
    const existingMessage = document.querySelector('.success, .error');
    if (existingMessage) {
      existingMessage.remove();
    }
  };

  // Блокировка кнопки отправки
  const toggleSubmitButton = (isDisabled) => {
    if (submitButton) {
      submitButton.disabled = isDisabled;
      submitButton.textContent = isDisabled ? 'Публикую...' : 'Опубликовать';
    }
  };

  // Обработчик отправки формы
  const onFormSubmit = async (evt) => {
    evt.preventDefault();

    if (!pristine) {
      console.error('Валидатор не инициализирован');
      return;
    }

    const isValid = pristine.validate();

    if (!isValid) {
      if (hashtagInput) {
        hashtagInput.focus();
      }
      return;
    }

    try {
      toggleSubmitButton(true);

      // Собираем данные формы
      const formData = new FormData(form);

      // Отправляем данные на сервер
      await sendData(formData);

      // Успешная отправка
      showMessage('success', 'Изображение успешно загружено!');

      // Закрываем форму
      closeForm();

    } catch (error) {
      // Ошибка отправки
      console.error('Ошибка при отправке формы:', error);
      showMessage('error', 'Ошибка загрузки файла. Попробуйте ещё раз.');

      toggleSubmitButton(false);
    }
  };

  // Инициализация
  const init = () => {
    if (!form) {
      console.error('Форма .img-upload__form не найдена');
      return;
    }

    console.log('Инициализация формы...');

    // Инициализируем загрузчик изображений
    initImageLoader();

    // Инициализируем редактор изображений
    if (typeof imageEditor?.init === 'function') {
      imageEditor.init();
    }

    // Обработчики событий
    if (fileInput) {
      fileInput.addEventListener('change', onFileInputChange);
    }

    if (cancelButton) {
      cancelButton.addEventListener('click', closeForm);
    }

    form.addEventListener('submit', onFormSubmit);

    if (hashtagInput) {
      hashtagInput.addEventListener('input', () => {
        if (pristine) {
          pristine.validate(hashtagInput);
        }
      });
    }

    if (commentInput) {
      commentInput.addEventListener('input', () => {
        if (pristine) {
          pristine.validate(commentInput);
        }
      });
    }

    // Обработка кнопки сброса
    const resetButton = form.querySelector('[type="reset"]');
    if (resetButton) {
      resetButton.addEventListener('click', resetForm);
    }

    // Обработка нажатия ESC когда фокус в поле ввода
    if (hashtagInput) {
      hashtagInput.addEventListener('keydown', (evt) => {
        if (evt.key === 'Escape') {
          evt.stopPropagation();
        }
      });
    }

    if (commentInput) {
      commentInput.addEventListener('keydown', (evt) => {
        if (evt.key === 'Escape') {
          evt.stopPropagation();
        }
      });
    }

    console.log('Форма успешно инициализирована');
  };

  return {
    init,
    closeForm,
    resetForm
  };
})();

export default formModule;
