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
        commentsElement.textContent = picture.comments;

        fragment.appendChild(pictureElement);
    });

    const picturesContainer = document.querySelector('.pictures');
    if (picturesContainer) {
        picturesContainer.appendChild(fragment);
    } else {
        console.error('Контейнер .pictures не найден!');
    }
}
