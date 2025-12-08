import {showBigPicture} from './big-picture.js';
const pictures = document.querySelector('.pictures');

const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

const removePictures = () => {
  document.querySelectorAll('.picture').forEach((photo) => photo.remove());
};

const renderPicture = (photo) => {

  const {url, description, comments, likes} = photo;

  const pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = url;

  pictureElement.querySelector('.picture__img').alt = description;

  pictureElement.querySelector('.picture__comments').textContent = comments.length;

  pictureElement.querySelector('.picture__likes').textContent = likes;

  const onPictureElementClick = (evt) => {
    evt.preventDefault();

    showBigPicture(photo);
  };

  pictureElement.addEventListener('click', onPictureElementClick);

  return pictureElement;

};

const fragment = document.createDocumentFragment();

const renderPictures = (photos) => {

  photos.forEach((photo) => {

    fragment.appendChild(renderPicture(photo));

  });

  pictures.appendChild(fragment);

};

export {renderPictures, removePictures};
