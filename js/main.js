import { fetchPhotos } from './api.js';
import { showAlertMessage } from './utils.js';
import { displayPhotoThumbnails } from './thumbnail-renderer.js';
import { openFullSizeView, initializeFullscreenViewer } from './fullscreen-viewer.js';
import { initializeUploadForm } from './upload-form.js';
import { initializeFilters } from './picture-filters.js';

initializeUploadForm();
initializeFullscreenViewer();

fetchPhotos()
  .then((photosData) => {
    displayPhotoThumbnails(photosData);
    initializeFilters(photosData);
    document.querySelector('.pictures').addEventListener('click', (event) => {
      const clickedThumbnail = event.target.closest('.picture');
      if (!clickedThumbnail) {
        return;
      }
      event.preventDefault();
      const photoId = parseInt(clickedThumbnail.dataset.photoId, 10);
      const targetPhotoData = photosData.find((photo) => photo.id === photoId);
      if (targetPhotoData) {
        openFullSizeView(targetPhotoData);
      }
    });
  })
  .catch((error) => {
    showAlertMessage(error.message);
  });
