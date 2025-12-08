import { openBigPicture } from './big-picture.js';
import { loadAndRenderPictures } from './pictures.js';
import { initFormHandlers } from './form-validation.js';

let picturesData = [];

const initThumbnailHandlers = () => {
    const thumbnails = document.querySelectorAll('.picture');

    thumbnails.forEach((thumbnail, index) => {
        thumbnail.replaceWith(thumbnail.cloneNode(true));
        const newThumbnail = thumbnails[index];

        newThumbnail.addEventListener('click', (evt) => {
            evt.preventDefault();

            if (picturesData && picturesData[index]) {
                openBigPicture(picturesData[index]);
            }
        });
    });
};

const initApp = async () => {
    try {
        picturesData = await loadAndRenderPictures();
        initThumbnailHandlers();
        if (typeof initFormHandlers === 'function') {
            initFormHandlers();
        }

        console.log('Приложение инициализировано. Загружено фотографий:', picturesData.length);

    } catch (error) {
        console.error('Ошибка инициализации приложения:', error);
    }
};

document.addEventListener('DOMContentLoaded', initApp);

export { picturesData };
