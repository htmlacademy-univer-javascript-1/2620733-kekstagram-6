import { openBigPicture } from './big-picture.js';

thumbnails.forEach((thumbnail, index) => {
  thumbnail.addEventListener('click', () => {
    openBigPicture(picturesData[index]);
  });
});
