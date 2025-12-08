const COMMENTS_PER_PORTION = 5;

const KEY_ESCAPE = 'Escape';

const bodyElement = document.querySelector('body');
const bigPictureElement = document.querySelector('.big-picture');
const bigPictureImage = bigPictureElement.querySelector('.big-picture__img img');
const likesCountElement = bigPictureElement.querySelector('.likes-count');
const commentsCountElement = bigPictureElement.querySelector('.comments-count');
const socialCommentsElement = bigPictureElement.querySelector('.social__comments');
const socialCaptionElement = bigPictureElement.querySelector('.social__caption');
const commentCountBlockElement = bigPictureElement.querySelector('.social__comment-count');
const commentsLoaderElement = bigPictureElement.querySelector('.comments-loader');
const cancelButtonElement = bigPictureElement.querySelector('.big-picture__cancel');

let currentComments = [];
let commentsShown = 0;

const createCommentElement = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const avatarImage = document.createElement('img');
  avatarImage.classList.add('social__picture');
  avatarImage.src = comment.avatar;
  avatarImage.alt = comment.name;
  avatarImage.width = 35;
  avatarImage.height = 35;

  const commentText = document.createElement('p');
  commentText.classList.add('social__text');
  commentText.textContent = comment.message;

  commentElement.appendChild(avatarImage);
  commentElement.appendChild(commentText);

  return commentElement;
};

const renderCommentsPortion = () => {
  const startIndex = commentsShown;
  const endIndex = commentsShown + COMMENTS_PER_PORTION;
  const commentsToShow = currentComments.slice(startIndex, endIndex);

  const fragment = document.createDocumentFragment();

  commentsToShow.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    fragment.appendChild(commentElement);
  });

  socialCommentsElement.appendChild(fragment);
  commentsShown += commentsToShow.length;

  const commentCountText = `${commentsShown} из ${currentComments.length} комментариев`;
  const firstChild = commentCountBlockElement.firstChild;
  if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
    firstChild.textContent = commentCountText;
  } else {
    commentCountBlockElement.textContent = commentCountText;
  }

  if (commentsShown >= currentComments.length) {
    commentsLoaderElement.classList.add('hidden');
  } else {
    commentsLoaderElement.classList.remove('hidden');
  }
};

const resetComments = () => {
  currentComments = [];
  commentsShown = 0;
  while (socialCommentsElement.firstChild) {
    socialCommentsElement.removeChild(socialCommentsElement.firstChild);
  }
};

const onDocumentKeydown = (evt) => {
  if (evt.key === KEY_ESCAPE) {
    evt.preventDefault();
    closeBigPicture();
  }
};

const onCommentsLoaderClick = () => {
  renderCommentsPortion();
};

const closeBigPicture = () => {
  bigPictureElement.classList.add('hidden');
  bodyElement.classList.remove('modal-open');

  document.removeEventListener('keydown', onDocumentKeydown);
  cancelButtonElement.removeEventListener('click', closeBigPicture);
  commentsLoaderElement.removeEventListener('click', onCommentsLoaderClick);

  resetComments();
};

const openBigPicture = (pictureData) => {
  resetComments();

  bigPictureImage.src = pictureData.url;
  bigPictureImage.alt = pictureData.description;
  likesCountElement.textContent = String(pictureData.likes);
  commentsCountElement.textContent = String(pictureData.comments.length);
  socialCaptionElement.textContent = pictureData.description;

  currentComments = pictureData.comments.slice();

  commentCountBlockElement.classList.remove('hidden');
  commentsLoaderElement.classList.remove('hidden');

  renderCommentsPortion();

  bigPictureElement.classList.remove('hidden');
  bodyElement.classList.add('modal-open');

  document.addEventListener('keydown', onDocumentKeydown);
  cancelButtonElement.addEventListener('click', closeBigPicture);
  commentsLoaderElement.addEventListener('click', onCommentsLoaderClick);
};

const onBigPictureClick = (evt) => {
  if (evt.target === bigPictureElement) {
    closeBigPicture();
  }
};

if (bigPictureElement) {
  bigPictureElement.addEventListener('click', onBigPictureClick);
}

export { openBigPicture };
