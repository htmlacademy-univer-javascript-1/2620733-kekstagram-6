'use strict';

const COMMENTS_PER_PORTION = 5;
const MAX_COMMENT_LENGTH = 140;
const DEFAULT_AVATAR = 'img/avatar-default.svg';

const validateComment = (comment) => {
  if (!comment || typeof comment !== 'object') {
    return false;
  }

  const hasMessage = typeof comment.message === 'string' && comment.message.trim() !== '';
  const hasValidMessageLength = comment.message.length <= MAX_COMMENT_LENGTH;
  const hasName = typeof comment.name === 'string' && comment.name.trim() !== '';

  return hasMessage && hasValidMessageLength && hasName;
};

const createCommentElement = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const avatarImage = document.createElement('img');
  avatarImage.classList.add('social__picture');
  avatarImage.src = comment.avatar || DEFAULT_AVATAR;
  avatarImage.alt = comment.name || 'Анонимный пользователь';
  avatarImage.width = 35;
  avatarImage.height = 35;

  const commentText = document.createElement('p');
  commentText.classList.add('social__text');
  commentText.textContent = comment.message;

  commentElement.append(avatarImage, commentText);

  return commentElement;
};

const renderCommentsPortion = (comments, container, startIndex) => {
  if (!Array.isArray(comments) || !container) {
    return { renderedCount: 0, totalCount: 0, hasMore: false };
  }

  const endIndex = Math.min(startIndex + COMMENTS_PER_PORTION, comments.length);
  const commentsToShow = comments.slice(startIndex, endIndex);

  const fragment = document.createDocumentFragment();

  let validCommentsCount = 0;
  commentsToShow.forEach((comment) => {
    if (validateComment(comment)) {
      const commentElement = createCommentElement(comment);
      fragment.append(commentElement);
      validCommentsCount++;
    }
  });

  container.append(fragment);

  return {
    renderedCount: startIndex + validCommentsCount,
    totalCount: comments.length,
    hasMore: endIndex < comments.length
  };
};

const clearComments = (container) => {
  if (!container) {
    return;
  }

  container.innerHTML = '';
};

const formatCommentsCount = (count) => {
  if (count === 0) {
    return 'Нет комментариев';
  }

  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return `${count} комментариев`;
  }

  switch (lastDigit) {
    case 1:
      return `${count} комментарий`;
    case 2:
    case 3:
    case 4:
      return `${count} комментария`;
    default:
      return `${count} комментариев`;
  }
};

export {
  validateComment,
  createCommentElement,
  renderCommentsPortion,
  clearComments,
  formatCommentsCount
};
