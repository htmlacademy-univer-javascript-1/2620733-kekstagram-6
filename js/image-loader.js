'use strict';

const FILE_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const DEFAULT_AVATAR_SRC = 'img/upload-default-image.jpg';

const createImageLoader = () => {
  const fileInputElement = document.querySelector('.img-upload__input, .img-upload_input');
  const previewImageElement = document.querySelector('.img-upload__preview img');
  const effectsPreviewsElements = document.querySelectorAll('.effects__preview');

  const isValidFileType = (file) => {
    if (!file || typeof file.name !== 'string') {
      return false;
    }
    const fileName = file.name.toLowerCase();
    return FILE_TYPES.some(type => fileName.endsWith(`.${type}`)) &&
           file.type.startsWith('image/');
  };

  const loadAndPreviewImage = (file) => {
    if (!file) {
      return false;
    }

    if (!isValidFileType(file)) {
      const allowed = FILE_TYPES.map(type => `.${type}`).join(', ');
      window.alert(`Пожалуйста, выберите файл изображения (${allowed})`);
      return false;
    }

    const reader = new FileReader();

    reader.addEventListener('load', () => {
      if (previewImageElement) {
        previewImageElement.src = reader.result;
        previewImageElement.alt = file.name;
      }

      effectsPreviewsElements.forEach(el => {
        el.style.backgroundImage = `url(${reader.result})`;
      });
    });

    reader.addEventListener('error', () => {
      window.alert('Не удалось загрузить выбранный файл');
    });

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

    effectsPreviewsElements.forEach(el => {
      el.style.backgroundImage = '';
    });
  };

  const init = () => {
    if (!fileInputElement || !previewImageElement) {
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

export const initImageLoader = imageLoader.init;
export const resetUploadedImage = imageLoader.resetUploadedImage;
export const loadAndPreviewImage = imageLoader.loadAndPreviewImage;
export const destroyImageLoader = imageLoader.destroy;


export default imageLoader;
