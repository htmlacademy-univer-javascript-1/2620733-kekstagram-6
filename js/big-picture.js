const body = document.querySelector('body');
const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCaption = bigPicture.querySelector('.social__caption');
const commentCountBlock = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const cancelButton = bigPicture.querySelector('.big-picture__cancel');

let currentComments = [];
let commentsShown = 0;
const COMMENTS_PER_PORTION = 5;

const createComment = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const avatarImg = document.createElement('img');
  avatarImg.classList.add('social__picture');
  avatarImg.src = comment.avatar;
  avatarImg.alt = comment.name;
  avatarImg.width = 35;
  avatarImg.height = 35;

  const commentText = document.createElement('p');
  commentText.classList.add('social__text');
  commentText.textContent = comment.message;

  commentElement.appendChild(avatarImg);
  commentElement.appendChild(commentText);

  return commentElement;
};

const renderCommentsPortion = () => {
  const commentsToShow = currentComments.slice(commentsShown, commentsShown + COMMENTS_PER_PORTION);

  commentsToShow.forEach(comment => {
    const commentElement = createComment(comment);
    socialComments.appendChild(commentElement);
  });

  commentsShown += commentsToShow.length;

  const commentCountText = `${commentsShown} из ${currentComments.length} комментариев`;
  commentCountBlock.innerHTML = commentCountText;

  if (commentsShown >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
};

const resetComments = () => {
  currentComments = [];
  commentsShown = 0;
  socialComments.innerHTML = '';
};

const openBigPicture = (pictureData) => {
  resetComments();

  bigPictureImg.src = pictureData.url;
  likesCount.textContent = pictureData.likes;
  commentsCount.textContent = pictureData.comments.length;
  socialCaption.textContent = pictureData.description;

  currentComments = pictureData.comments;

  commentCountBlock.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  renderCommentsPortion();

  bigPicture.classList.remove('hidden');

  body.classList.add('modal-open');

  document.addEventListener('keydown', onDocumentKeydown);
  cancelButton.addEventListener('click', closeBigPicture);
  commentsLoader.addEventListener('click', onCommentsLoaderClick);
};

const closeBigPicture = () => {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');

  document.removeEventListener('keydown', onDocumentKeydown);
  cancelButton.removeEventListener('click', closeBigPicture);
  commentsLoader.removeEventListener('click', onCommentsLoaderClick);

  resetComments();
};

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeBigPicture();
  }
};

const onCommentsLoaderClick = () => {
  renderCommentsPortion();
};

bigPicture.addEventListener('click', (evt) => {
  if (evt.target === bigPicture) {
    closeBigPicture();
  }
});

export { openBigPicture };
