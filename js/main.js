import { openBigPicture } from './big-picture.js';
import { loadAndRenderPictures } from './pictures.js';
import formModule from './form-validation.js';
import imageEditor from './image-editor.js';

let allPhotos = [];

const initThumbnailHandlers = () => {
  const picturesContainer = document.querySelector('.pictures');

  if (!picturesContainer) return;

  picturesContainer.addEventListener('click', (evt) => {
    const pictureElement = evt.target.closest('.picture');

    if (pictureElement) {
      evt.preventDefault();

      const pictureElements = picturesContainer.querySelectorAll('.picture');
      const index = Array.from(pictureElements).indexOf(pictureElement);

      if (index !== -1 && allPhotos[index]) {
        openBigPicture(allPhotos[index]);
      }
    }
  });
};

const initApp = async () => {
  try {
    console.log('Инициализация приложения...');

    allPhotos = await loadAndRenderPictures() || [];

    initThumbnailHandlers();

    formModule.init();

    if (typeof imageEditor.init === 'function') {
      imageEditor.init();
    }

    console.log('Приложение успешно инициализировано');

  } catch (error) {
    console.error('Ошибка при инициализации приложения:', error);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

export { allPhotos };
