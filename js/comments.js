import { getRandomInt } from "./util.js";
import { COMMENT_MESSAGES, COMMENT_NAMES }
from "./data.js";


const usedCommentIds = new Set();

function getUniqueCommentId() {
  let candidate = getRandomInt(1, 10000);
  while (usedCommentIds.has(candidate)) {
    candidate = getRandomInt(1, 10000);
  }
  usedCommentIds.add(candidate);
  return candidate;
}

function getRandomMessage() {
  const count = getRandomInt(1, 2);
  let chosen = [];
  while (chosen.length < count) {
    const index = getRandomInt(0, COMMENT_MESSAGES.length - 1);
    if (!chosen.includes(COMMENT_MESSAGES[index])) {
      chosen.push(COMMENT_MESSAGES[index]);
    }
  }
  return chosen.join(' ');
}

export function generateComment() {
  return {
    id: getUniqueCommentId(),
    avatar: `img/avatar-${getRandomInt(1, 6)}.svg`,
    message: getRandomMessage(),
    name: COMMENT_NAMES[getRandomInt(0, COMMENT_NAMES.length - 1)]
  };
}
