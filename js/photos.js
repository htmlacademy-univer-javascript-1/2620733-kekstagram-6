import { DESCRIPTIONS } from "./data.js";
import { getRandomInt, getUniqueNumbers } from "./util.js";
import { generateComment } from "./comments.js";

export function generatePhotos(num = 25) {
  const photoIds = getUniqueNumbers(num, 1, 25);
  const urls = [...photoIds];
  const photos = [];

  for (let i = 0; i < num; i++) {
    const description = DESCRIPTIONS[i % DESCRIPTIONS.length];
    const likes = getRandomInt(15, 200);
    const commentsCount = getRandomInt(0, 30);
    const comments = Array.from({ length: commentsCount }, generateComment);

    photos.push({
      id: photoIds[i],
      url: `photos/${photoIds[i]}`.jpg,
      description,
      likes,
      comments
    });
  }

  return photos;
}
