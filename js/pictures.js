import { getData } from './api.js';
import { initFilters } from './filters.js';

let allPhotos = [];

export function renderPictures(picturesData) {
    const pictureTemplate = document.getElementById('picture').content;
    const fragment = document.createDocumentFragment();

    picturesData.forEach((picture) => {
        const pictureElement = pictureTemplate.cloneNode(true);
        const imgElement = pictureElement.querySelector('.picture__img');
        const likesElement = pictureElement.querySelector('.picture__likes');
        const commentsElement = pictureElement.querySelector('.picture__comments');

        imgElement.src = picture.url;
        imgElement.alt = picture.description;
        likesElement.textContent = picture.likes;
        commentsElement.textContent = picture.comments.length;

        pictureElement.querySelector('.picture').dataset.id = picture.id;

        fragment.appendChild(pictureElement);
    });

    const picturesContainer = document.querySelector('.pictures');
    if (picturesContainer) {
        picturesContainer.innerHTML = '';
        picturesContainer.appendChild(fragment);
    } else {
        console.error('Контейнер .pictures не найден!');
    }
}

export const loadAndRenderPictures = async () => {
    try {
        const picturesContainer = document.querySelector('.pictures');
        if (picturesContainer) {
            picturesContainer.innerHTML = '<div class="loading">Загрузка фотографий...</div>';
        }

        allPhotos = await getData();

        renderPictures(allPhotos);

        initFilters(allPhotos, renderPictures);

        return allPhotos;

    } catch (error) {
        const picturesContainer = document.querySelector('.pictures');
        if (picturesContainer) {
            picturesContainer.innerHTML = `
                <div class="error-message">
                    <p>Не удалось загрузить фотографии</p>
                    <button class="retry-button">Попробовать снова</button>
                </div>
            `;

            const retryButton = picturesContainer.querySelector('.retry-button');
            if (retryButton) {
                retryButton.addEventListener('click', loadAndRenderPictures);
            }
        }

        console.error('Ошибка загрузки фотографий:', error);
        return [];
    }
};

export { allPhotos };
