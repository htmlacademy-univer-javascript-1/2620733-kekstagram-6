const FILE_TYPES = Object.freeze(['jpg', 'jpeg', 'png', 'gif', 'webp']);
const DEFAULT_AVATAR_SRC = 'img/upload-default-image.jpg';
const ALLOWED_FILE_EXTENSIONS = FILE_TYPES.map((type) => `.${type}`).join(', ');

const createImageLoader = () => {
  const fileInputElement = document.querySelector('.img-upload__input');
  const previewImageElement = document.querySelector('.img-upload__preview img');
  const effectsPreviewsElements = document.querySelectorAll('.effects__preview');

  const isValidFileType = (file) => {
    // Б14. Проверка параметров
    if (!file || typeof file.name !== 'string') {
      return false;
    }

    const fileName = file.name.toLowerCase();
    const hasValidExtension = FILE_TYPES.some((type) => {
      return fileName.endsWith(`.${type}`);
    });

    const hasValidMimeType = file.type.startsWith('image/');

    return hasValidExtension && hasValidMimeType;
  };

  const showErrorMessage = (message) => {
    window.alert(message);
  };

  const loadAndPreviewImage = (file) => {
    if (!file) {
      return false;
    }

    if (!isValidFileType(file)) {
      const errorMessage = `Пожалуйста, выберите файл изображения (${ALLOWED_FILE_EXTENSIONS})`;
      showErrorMessage(errorMessage);
      return false;
    }

    const reader = new FileReader();

    const onLoadSuccess = () => {
      if (previewImageElement) {
        previewImageElement.src = reader.result;
        previewImageElement.alt = file.name;
      }

      if (effectsPreviewsElements.length > 0) {
        const backgroundImageValue = `url(${reader.result})`;
        effectsPreviewsElements.forEach((effectPreview) => {
          effectPreview.style.backgroundImage = backgroundImageValue;
        });
      }

      if (window.imageEditor && typeof window.imageEditor.reset === 'function') {
        window.imageEditor.reset();
      }
    };

    const onLoadError = () => {
      showErrorMessage('Не удалось загрузить выбранный файл');
    };

    reader.addEventListener('load', onLoadSuccess);
    reader.addEventListener('error', onLoadError);

    reader.readAsDataURL(file);
    return true;
  };

  const onFileInputChange = () => {
    if (!fileInputElement || !fileInputElement.files) {
      return;
    }

    const file = fileInputElement.files[0];
    if (!file) {
      return;
    }

    const isSuccess = loadAndPreviewImage(file);
    if (!isSuccess) {
      resetUploadedImage();
    }
  };

  const resetUploadedImage = () => {
    if (fileInputElement) {
      fileInputElement.value = '';
    }

    if (previewImageElement) {
      previewImageElement.src = DEFAULT_AVATAR_SRC;
      previewImageElement.alt = 'Изображение по умолчанию';
    }

    if (effectsPreviewsElements.length > 0) {
      effectsPreviewsElements.forEach((effectPreview) => {
        effectPreview.style.backgroundImage = '';
      });
    }
  };

  const validateDomElements = () => {
    const errors = [];

    if (!fileInputElement) {
      errors.push('Не найден элемент .img-upload__input');
    }

    if (!previewImageElement) {
      errors.push('Не найден элемент .img-upload__preview img');
    }

    return errors;
  };

  const init = () => {
    const validationErrors = validateDomElements();
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => console.error(error));
      return;
    }

    const currentSrc = previewImageElement.src;
    const isEmptySrc = !currentSrc || currentSrc === '' || currentSrc === window.location.href;

    if (isEmptySrc) {
      previewImageElement.src = DEFAULT_AVATAR_SRC;
    }

    fileInputElement.addEventListener('change', onFileInputChange);
  };

  const destroy = () => {
    if (fileInputElement) {
      fileInputElement.removeEventListener('change', onFileInputChange);
    }
  };

  return {
    init,
    destroy,
    resetUploadedImage,
    loadAndPreviewImage
  };
};

const imageLoader = createImageLoader();

export default imageLoader;
