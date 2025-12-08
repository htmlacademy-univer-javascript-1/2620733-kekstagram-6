const FILE_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const DEFAULT_AVATAR_SRC = 'img/upload-default-image.jpg';

const fileInput = document.querySelector('.img-upload__input');
const previewImage = document.querySelector('.img-upload__preview img');
const effectsPreviews = document.querySelectorAll('.effects__preview');

const isValidFileType = (file) => {
  const fileName = file.name.toLowerCase();
  return FILE_TYPES.some((type) => fileName.endsWith(`.${type}`));
};

const loadAndPreviewImage = (file) => {
  if (!file || !isValidFileType(file)) {
    alert('Пожалуйста, выберите файл изображения (jpg, jpeg, png, gif, webp)');
    return false;
  }

  const reader = new FileReader();

  reader.addEventListener('load', () => {
    previewImage.src = reader.result;

    if (effectsPreviews.length > 0) {
      effectsPreviews.forEach((effectPreview) => {
        effectPreview.style.backgroundImage = `url(${reader.result})`;
      });
    }

    if (typeof window.imageEditor?.reset === 'function') {
      window.imageEditor.reset();
    }
  });

  reader.readAsDataURL(file);
  return true;
};

const onFileInputChange = () => {
  const file = fileInput.files[0];

  if (file) {
    const success = loadAndPreviewImage(file);

    if (!success) {
      fileInput.value = '';
      previewImage.src = DEFAULT_AVATAR_SRC;

      if (effectsPreviews.length > 0) {
        effectsPreviews.forEach((effectPreview) => {
          effectPreview.style.backgroundImage = '';
        });
      }
    }
  }
};

const resetUploadedImage = () => {
  if (fileInput) {
    fileInput.value = '';
  }

  if (previewImage) {
    previewImage.src = DEFAULT_AVATAR_SRC;
  }

  if (effectsPreviews.length > 0) {
    effectsPreviews.forEach((effectPreview) => {
      effectPreview.style.backgroundImage = '';
    });
  }
};

const initImageLoader = () => {
  if (!fileInput) {
    console.error('Не найден элемент .img-upload__input');
    return;
  }

  if (!previewImage) {
    console.error('Не найден элемент .img-upload__preview img');
    return;
  }

  if (!previewImage.src || previewImage.src === window.location.href) {
    previewImage.src = DEFAULT_AVATAR_SRC;
  }

  fileInput.addEventListener('change', onFileInputChange);

  console.log('Image loader initialized');
};

export { initImageLoader, resetUploadedImage, loadAndPreviewImage };
