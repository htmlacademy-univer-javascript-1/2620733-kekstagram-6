const COMMENTS_BATCH_SIZE = 5;

const fullSizeImageModal = document.querySelector('.big-picture');
const fullSizeImage = fullSizeImageModal.querySelector('.big-picture__img img');
const likesCounter = fullSizeImageModal.querySelector('.likes-count');
const totalCommentsCounter = fullSizeImageModal.querySelector('.comments-count');
const commentsList = fullSizeImageModal.querySelector('.social__comments');
const imageDescription = fullSizeImageModal.querySelector('.social__caption');
const commentsCounterBlock = fullSizeImageModal.querySelector('.social__comment-count');
const loadMoreCommentsButton = fullSizeImageModal.querySelector('.comments-loader');
const closeModalButton = fullSizeImageModal.querySelector('.big-picture__cancel');

let currentPhotoComments = [];
let displayedCommentsCount = 0;

const closeFullSizeView = () => {
  fullSizeImageModal.classList.add('hidden');
  document.body.classList.remove('modal-open');
  currentPhotoComments = [];
  displayedCommentsCount = 0;
};

const onModalClose = () => closeFullSizeView();

const onEscapeKeyPress = (event) => {
  if (event.key === 'Escape') {
    closeFullSizeView();
  }
};

const createCommentElement = (commentData) => {
  const commentItem = document.createElement('li');
  commentItem.classList.add('social__comment');
  const avatarImage = document.createElement('img');
  avatarImage.classList.add('social__picture');
  avatarImage.src = commentData.avatar;
  avatarImage.alt = commentData.name;
  avatarImage.width = 35;
  avatarImage.height = 35;
  const commentText = document.createElement('p');
  commentText.classList.add('social__text');
  commentText.textContent = commentData.message;
  commentItem.appendChild(avatarImage);
  commentItem.appendChild(commentText);
  return commentItem;
};

const renderCommentsBatch = () => {
  const commentsToRender = currentPhotoComments.slice(displayedCommentsCount, displayedCommentsCount + COMMENTS_BATCH_SIZE);
  const commentFragment = document.createDocumentFragment();
  commentsToRender.forEach((comment) => {
    commentFragment.appendChild(createCommentElement(comment));
  });
  commentsList.appendChild(commentFragment);
  displayedCommentsCount += commentsToRender.length;
  const shownCountElement = commentsCounterBlock.querySelector('.social__comment-shown-count');
  shownCountElement.textContent = displayedCommentsCount;
  if (displayedCommentsCount >= currentPhotoComments.length) {
    loadMoreCommentsButton.classList.add('hidden');
  }
};

const openFullSizeView = (photoData) => {
  fullSizeImageModal.classList.remove('hidden');
  document.body.classList.add('modal-open');
  fullSizeImage.src = photoData.url;
  fullSizeImage.alt = photoData.description;
  likesCounter.textContent = photoData.likes;
  totalCommentsCounter.textContent = photoData.comments.length;
  imageDescription.textContent = photoData.description;
  commentsList.innerHTML = '';
  currentPhotoComments = photoData.comments;
  displayedCommentsCount = 0;
  loadMoreCommentsButton.classList.remove('hidden');
  renderCommentsBatch();
};

const initializeFullscreenViewer = () => {
  closeModalButton.addEventListener('click', onModalClose);
  document.addEventListener('keydown', onEscapeKeyPress);
  loadMoreCommentsButton.addEventListener('click', renderCommentsBatch);
};

export { openFullSizeView, initializeFullscreenViewer };
