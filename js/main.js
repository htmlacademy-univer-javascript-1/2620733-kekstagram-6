
const COMMENT_MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра.',
  'В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают.',
  'Как можно было поймать такой неудачный момент?!'
];

const COMMENT_NAMES = [
  'Аркадий', 'Виктория', 'Василиса', 'Геннадий',
  'Кирилл', 'Семен', 'Маргарита', 'Полина'
];

const DESCRIPTIONS = [
  'Красивый вид!',
  'Невероятное место для отдыха.',
  'Лучшие моменты жизни.',
  'Улыбка – залог удачи.',
  'Воспоминания forever.',
  'Мир удивителен!',
  'Семейный ужин.',
  'Рождественское настроение.',
  'Вот это кадр!',
  'Горжусь собой.',
  'Огни большого города.',
  'Зимняя сказка.',
  'Как в кино!',
  'Солнечное утро.',
  'Доброе настроение.',
  'Время приключений.',
  'Лучшие друзья.',
  'Вечер у костра.',
  'Пикник в парке.',
  'Закат на море.',
  'Фото на память.',
  'Очаровательная компания.',
  'День рождения.',
  'Новый взгляд.',
  'Энергия жизни.'
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getUniqueNumbers(count, min, max) {
  const numbers = [];
  while (numbers.length < count) {
    const num = getRandomInt(min, max);
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers;
}

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

function generateComment() {
  return {
    id: getUniqueCommentId(),
    avatar: `img/avatar-${getRandomInt(1, 6)}.svg`,
    message: getRandomMessage(),
    name: COMMENT_NAMES[getRandomInt(0, COMMENT_NAMES.length - 1)]
  };
}

function generatePhotos(num = 25) {
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

const photosArray = generatePhotos(25);
