const fullscreenViewer = (function() {
  const bigPicture = document.querySelector('.big-picture');
  const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
  const likesCount = bigPicture.querySelector('.likes-count');
  const commentsCount = bigPicture.querySelector('.comments-count');
  const socialComments = bigPicture.querySelector('.social__comments');
  const socialCaption = bigPicture.querySelector('.social__caption');
  const commentCountBlock = bigPicture.querySelector('.social__comment-count');
  const commentsLoader = bigPicture.querySelector('.comments-loader');
  const cancelButton = bigPicture.querySelector('.big-picture__cancel');

  const COMMENTS_PER_PORTION = 5;
  let currentComments = [];
  let shownCommentsCount = 0;

  function openFullscreen(photoData) {
    bigPicture.classList.remove('hidden');
    document.body.classList.add('modal-open');

    bigPictureImg.src = photoData.url;
    bigPictureImg.alt = photoData.description;
    likesCount.textContent = photoData.likes;
    commentsCount.textContent = photoData.comments.length;
    socialCaption.textContent = photoData.description;

    commentCountBlock.classList.remove('hidden');
    commentsLoader.classList.remove('hidden');

    currentComments = photoData.comments;
    shownCommentsCount = 0;

    renderComments();
  }

  function renderComments() {
    socialComments.innerHTML = '';

    const commentsToShow = Math.min(
      shownCommentsCount + COMMENTS_PER_PORTION,
      currentComments.length
    );

    for (let i = 0; i < commentsToShow; i++) {
      const comment = currentComments[i];
      const commentElement = document.createElement('li');
      commentElement.classList.add('social__comment');

      commentElement.innerHTML = `
        <img
          class="social__picture"
          src="${comment.avatar}"
          alt="${comment.name}"
          width="35" height="35">
        <p class="social__text">${comment.message}</p>
      `;

      socialComments.appendChild(commentElement);
    }

    shownCommentsCount = commentsToShow;
    updateCommentsCounter();

    if (shownCommentsCount >= currentComments.length) {
      commentsLoader.classList.add('hidden');
    } else {
      commentsLoader.classList.remove('hidden');
    }
  }

  function updateCommentsCounter() {
    const totalCountElement = commentCountBlock.querySelector('.social__comment-total-count');
    const shownCountElement = commentCountBlock.querySelector('.social__comment-shown-count');
    totalCountElement.textContent = currentComments.length;
    shownCountElement.textContent = shownCommentsCount;
  }

  function onLoadMoreCommentsClick() {
    renderComments();
  }

  function closeFullscreen() {
    bigPicture.classList.add('hidden');
    document.body.classList.remove('modal-open');
    currentComments = [];
    shownCommentsCount = 0;
  }

  function onCancelButtonClick() {
    closeFullscreen();
  }

  function onDocumentKeydown(evt) {
    if (evt.key === 'Escape') {
      closeFullscreen();
    }
  }

  function init() {
    cancelButton.addEventListener('click', onCancelButtonClick);
    commentsLoader.addEventListener('click', onLoadMoreCommentsClick);
    document.addEventListener('keydown', onDocumentKeydown);
  }

  return {
    openFullscreen,
    init
  };
})();

export default fullscreenViewer;
