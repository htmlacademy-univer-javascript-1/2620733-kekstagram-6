import { openBigPicture } from './big-picture.js';
import { loadAndRenderPictures, allPhotos } from './pictures.js';
import { initFormHandlers } from './form-validation.js';

const initThumbnailHandlers = () => {
    const picturesContainer = document.querySelector('.pictures');

    if (!picturesContainer) return;

    picturesContainer.addEventListener('click', (evt) => {
        const pictureElement = evt.target.closest('.picture');

        if (pictureElement) {
            evt.preventDefault();

            const pictureId = parseInt(pictureElement.dataset.id, 10);
            const pictureData = allPhotos.find(photo => photo.id === pictureId);

            if (pictureData) {
                openBigPicture(pictureData);
            }
        }
    });
};

const initApp = async () => {
    try {
        await loadAndRenderPictures();

        initThumbnailHandlers();

        if (typeof initFormHandlers === 'function') {
            initFormHandlers();
        }

        console.log('Приложение инициализировано');

    } catch (error) {
        console.error('Ошибка инициализации приложения:', error);
    }
};

document.addEventListener('DOMContentLoaded', initApp);
