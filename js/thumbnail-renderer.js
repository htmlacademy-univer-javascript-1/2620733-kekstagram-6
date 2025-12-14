const photoThumbnailTemplate = document.querySelector('#picture').content.querySelector('.picture');

const generateThumbnailElement = (photoDataItem) => {
  const thumbnailElement = photoThumbnailTemplate.cloneNode(true);
  const thumbnailImage = thumbnailElement.querySelector('.picture__img');
  thumbnailImage.src = photoDataItem.url;
  thumbnailImage.alt = photoDataItem.description;
  thumbnailElement.querySelector('.picture__comments').textContent = photoDataItem.comments.length;
  thumbnailElement.querySelector('.picture__likes').textContent = photoDataItem.likes;
  thumbnailElement.dataset.photoId = photoDataItem.id;
  return thumbnailElement;
};

const displayPhotoThumbnails = (photosArray) => {
  const picturesContainer = document.querySelector('.pictures');
  const documentFragment = document.createDocumentFragment();
  photosArray.forEach((photoItem) => {
    const thumbnail = generateThumbnailElement(photoItem);
    documentFragment.appendChild(thumbnail);
  });
  picturesContainer.appendChild(documentFragment);
};

export { displayPhotoThumbnails };
