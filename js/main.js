'use strict';

import { openBigPicture } from './big-picture.js';
import { loadAndRenderPictures } from './pictures.js';
import formModule from './form-validation.js';
import imageEditor from './image-editor.js';

let allPhotos = [];

const initThumbnailHandlers = () => {
  const picturesContainer = document.querySelector('.pictures');

  if (!picturesContainer) {
    return;
  }

  picturesContainer.addEventListener('click', (evt) => {
    const pictureElement = evt.target.closest('.picture');

    if (!pictureElement) {
      return;
    }

    evt.preventDefault();

    const pictureElements = picturesContainer.querySelectorAll('.picture');
    const index = Array.from(pictureElements).indexOf(pictureElement);

    if (index !== -1 && allPhotos[index]) {
      openBigPicture(allPhotos[index]);
    }
  });
};

const initApp = async () => {
  try {
    allPhotos = await loadAndRenderPictures() || [];

    initThumbnailHandlers();

    formModule.init();

    if (typeof imageEditor.init === 'function') {
      imageEditor.init();
    }

  } catch (error) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = 'Не удалось загрузить фотографии. Пожалуйста, попробуйте обновить страницу.';
    errorMessage.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #ff6b6b;
      color: white;
      padding: 20px;
      border-radius: 8px;
      z-index: 1000;
      text-align: center;
      max-width: 80%;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;

    const closeButton = document.createElement('button');
    closeButton.textContent = '✕';
    closeButton.style.cssText = `
      position: absolute;
      top: 5px;
      right: 10px;
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
    `;

    closeButton.addEventListener('click', () => {
      errorMessage.remove();
    });

    errorMessage.appendChild(closeButton);
    document.body.appendChild(errorMessage);
  }
};

const onDocumentReady = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
};

onDocumentReady();

export { allPhotos };
