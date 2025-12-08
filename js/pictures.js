'use strict';

import { getData } from './api.js';
import { initFilters } from './filters.js';

let allPhotos = [];

const renderPictures = (picturesData, container = null) => {
  const pictureTemplate = document.querySelector('#picture');
  if (!pictureTemplate || !pictureTemplate.content) {
    return;
  }

  const picturesContainer = container || document.querySelector('.pictures');
  if (!picturesContainer) {
    return;
  }

  const fragment = document.createDocumentFragment();

  picturesData.forEach((picture) => {
    const pictureElement = pictureTemplate.content.cloneNode(true);
    const imgElement = pictureElement.querySelector('.picture__img');
    const likesElement = pictureElement.querySelector('.picture__likes');
    const commentsElement = pictureElement.querySelector('.picture__comments');

    if (imgElement) {
      imgElement.src = picture.url;
      imgElement.alt = picture.description;
    }

    if (likesElement) {
      likesElement.textContent = String(picture.likes);
    }

    if (commentsElement) {
      commentsElement.textContent = String(picture.comments.length);
    }

    const pictureWrapper = pictureElement.querySelector('.picture');
    if (pictureWrapper && picture.id) {
      pictureWrapper.dataset.id = String(picture.id);
    }

    fragment.appendChild(pictureElement);
  });

  picturesContainer.appendChild(fragment);
};

const showLoading = () => {
  const picturesContainer = document.querySelector('.pictures');
  if (!picturesContainer) {
    return;
  }

  const loadingElement = document.createElement('div');
  loadingElement.className = 'loading';
  loadingElement.textContent = 'Загрузка фотографий...';
  loadingElement.style.cssText = `
    text-align: center;
    padding: 50px;
    font-size: 18px;
    color: #999;
  `;

  picturesContainer.innerHTML = '';
  picturesContainer.appendChild(loadingElement);
};

const showError = (retryCallback) => {
  const picturesContainer = document.querySelector('.pictures');
  if (!picturesContainer) {
    return;
  }

  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.innerHTML = `
    <p style="text-align: center; color: #ff6b6b; margin-bottom: 15px;">
      Не удалось загрузить фотографии
    </p>
    <button class="retry-button" style="
      display: block;
      margin: 0 auto;
      padding: 10px 20px;
      background-color: #4481c3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    ">Попробовать снова</button>
  `;

  picturesContainer.innerHTML = '';
  picturesContainer.appendChild(errorElement);

  const retryButton = picturesContainer.querySelector('.retry-button');
  if (retryButton && retryCallback) {
    const onRetryClick = () => {
      retryButton.removeEventListener('click', onRetryClick);
      retryCallback();
    };
    retryButton.addEventListener('click', onRetryClick);
  }
};

const loadAndRenderPictures = async () => {
  showLoading();

  try {
    const photos = await getData();

    if (!Array.isArray(photos)) {
      throw new Error('Получены некорректные данные');
    }

    allPhotos = [...photos];

    const picturesContainer = document.querySelector('.pictures');
    if (!picturesContainer) {
      return allPhotos;
    }

    picturesContainer.innerHTML = '';
    renderPictures(allPhotos, picturesContainer);

    initFilters(allPhotos, (filteredPhotos, fragment) => {
      picturesContainer.innerHTML = '';
      if (fragment) {
        picturesContainer.appendChild(fragment);
      } else {
        renderPictures(filteredPhotos, picturesContainer);
      }
    });

    return allPhotos;

  } catch (error) {
    showError(loadAndRenderPictures);
    return [];
  }
};

export { renderPictures, loadAndRenderPictures, allPhotos };
