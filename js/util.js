'use strict';

const getRandomInt = (min, max) => {
  if (min > max) {
    [min, max] = [max, min];
  }

  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getUniqueNumbers = (count, min, max) => {
  if (min > max) {
    [min, max] = [max, min];
  }

  const rangeSize = max - min + 1;
  if (count > rangeSize) {
    count = rangeSize;
  }

  const numbers = new Set();

  while (numbers.size < count) {
    const num = getRandomInt(min, max);
    numbers.add(num);
  }

  return Array.from(numbers);
};

const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

const shuffleArray = (array) => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

const getRandomElements = (array, count) => {
  if (!Array.isArray(array) || array.length === 0) {
    return [];
  }

  if (count <= 0) {
    return [];
  }

  if (array.length <= count) {
    return shuffleArray(array);
  }

  const indices = getUniqueNumbers(count, 0, array.length - 1);
  return indices.map((index) => array[index]);
};

const isEscapeKey = (evt) => {
  return evt.key === 'Escape' || evt.key === 'Esc' || evt.keyCode === 27;
};

const isEnterKey = (evt) => {
  return evt.key === 'Enter' || evt.keyCode === 13;
};

const isOutsideClick = (element, evt) => {
  return !element.contains(evt.target);
};

export {
  getRandomInt,
  getUniqueNumbers,
  debounce,
  shuffleArray,
  getRandomElements,
  isEscapeKey,
  isEnterKey,
  isOutsideClick
};
