import { getData } from './api.js';
import { showAlert } from './util.js';
import thumbnailRenderer from './big-picture.js';
import fullscreenViewer from './slider.js';
import { initUploadForm } from './form-validation.js';
import { initFilter } from './filters.js';

initUploadForm();

getData()
  .then((photos) => {
    thumbnailRenderer.renderThumbnails(photos);

    initFilter(photos);

    document.querySelector('.pictures').addEventListener('click', (evt) => {
      const thumbnail = evt.target.closest('.picture');
      if (thumbnail) {
        evt.preventDefault();
        const photoId = parseInt(thumbnail.dataset.photoId, 10);

        const photoData = photos.find((photo) => photo.id === photoId);

        if (photoData) {
          fullscreenViewer.openFullscreen(photoData);
        }
      }
    });

    fullscreenViewer.init();
  })
  .catch((err) => {
    showAlert(err.message);
  });
