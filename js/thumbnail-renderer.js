const thumbnailRenderer = (function() {

  function createThumbnail(photoData) {
    const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

    if (!pictureTemplate) {
      throw new Error('Шаблон #picture не найден в DOM');
    }

    const thumbnailElement = pictureTemplate.cloneNode(true);
    const image = thumbnailElement.querySelector('.picture__img');
    image.src = photoData.url;
    image.alt = photoData.description;
    thumbnailElement.querySelector('.picture__comments').textContent = photoData.comments.length;
    thumbnailElement.querySelector('.picture__likes').textContent = photoData.likes;

    thumbnailElement.dataset.photoId = photoData.id;
    return thumbnailElement;
  }

  function renderThumbnails(photosData) {
    const container = document.querySelector('.pictures');
    if (!container) {
      throw new Error('Контейнер .pictures не найден');
    }

    // Очищаем старые миниатюры
    container.innerHTML = '';

    const fragment = document.createDocumentFragment();
    photosData.forEach((photo) => {
      const thumbnail = createThumbnail(photo);
      fragment.appendChild(thumbnail);
    });
    container.appendChild(fragment);
  }

  return {
    renderThumbnails
  };
})();

export default thumbnailRenderer;
