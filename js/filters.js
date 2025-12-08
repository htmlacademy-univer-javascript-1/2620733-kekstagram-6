
import { debounce, getRandomElements } from './util.js';

const FilterType = {
  DEFAULT: 'default',
  RANDOM: 'random',
  DISCUSSED: 'discussed'
};

const RANDOM_PHOTOS_COUNT = 10;
const DEBOUNCE_DELAY = 500;
const UPDATE_ANIMATION_DELAY = 300;
const ACTIVE_BUTTON_CLASS = 'img-filters__button--active';
const UPDATING_CLASS = 'updating';
const FILTER_PREFIX = 'filter-';

const filtersContainerElement = document.querySelector('.img-filters');
const filterFormElement = document.querySelector('.img-filters__form');
const picturesContainerElement = document.querySelector('.pictures');

let currentFilter = FilterType.DEFAULT;
let allPhotos = [];
let renderPicturesCallback = null;

const getRandomPhotos = (photos) => {
  return getRandomElements(photos, RANDOM_PHOTOS_COUNT);
};

const getDiscussedPhotos = (photos) => {
  const photosCopy = [...photos];
  return photosCopy.sort((photoA, photoB) => {
    const commentsCountA = Array.isArray(photoA.comments) ? photoA.comments.length : 0;
    const commentsCountB = Array.isArray(photoB.comments) ? photoB.comments.length : 0;
    return commentsCountB - commentsCountA;
  });
};

const applyFilter = (photos, filterType) => {
  switch (filterType) {
    case FilterType.RANDOM:
      return getRandomPhotos(photos);
    case FilterType.DISCUSSED:
      return getDiscussedPhotos(photos);
    case FilterType.DEFAULT:
      return [...photos];
    default:
      return [...photos];
  }
};

const showFilters = () => {
  if (filtersContainerElement) {
    filtersContainerElement.classList.remove('img-filters--inactive');
  }
};

const setActiveFilter = (filterType) => {
  currentFilter = filterType;

  if (!filterFormElement) {
    return;
  }

  const buttons = filterFormElement.querySelectorAll('.img-filters__button');

  buttons.forEach((button) => {
    const isActive = button.id === `${FILTER_PREFIX}${filterType}`;

    if (isActive) {
      button.classList.add(ACTIVE_BUTTON_CLASS);
    } else {
      button.classList.remove(ACTIVE_BUTTON_CLASS);
    }
  });
};

const updatePhotosDisplay = (photos, callback) => {
  if (!picturesContainerElement || typeof callback !== 'function') {
    return;
  }

  picturesContainerElement.classList.add(UPDATING_CLASS);

  const filteredPhotos = applyFilter(photos, currentFilter);

  const oldPictures = picturesContainerElement.querySelectorAll('.picture');
  oldPictures.forEach((picture) => {
    picture.remove();
  });

  callback(filteredPhotos);

  setTimeout(() => {
    picturesContainerElement.classList.remove(UPDATING_CLASS);
  }, UPDATE_ANIMATION_DELAY);
};

const debouncedUpdateDisplay = debounce(() => {
  if (allPhotos.length > 0 && renderPicturesCallback) {
    updatePhotosDisplay(allPhotos, renderPicturesCallback);
  }
}, DEBOUNCE_DELAY);

const onFilterClick = (evt) => {
  const button = evt.target.closest('.img-filters__button');

  if (!button) {
    return;
  }

  const isButtonActive = button.classList.contains(ACTIVE_BUTTON_CLASS);
  if (isButtonActive) {
    return;
  }

  const filterId = button.id;
  if (!filterId.startsWith(FILTER_PREFIX)) {
    return;
  }

  const filterType = filterId.replace(FILTER_PREFIX, '');

  const isValidFilter = Object.values(FilterType).includes(filterType);
  if (!isValidFilter) {
    return;
  }

  setActiveFilter(filterType);
  debouncedUpdateDisplay();
};


const initFilters = (photos, renderFunction) => {
  if (!Array.isArray(photos) || photos.length === 0) {
    return;
  }

  if (typeof renderFunction !== 'function') {
    console.error('renderFunction должна быть функцией');
    return;
  }

  allPhotos = photos.slice();
  renderPicturesCallback = renderFunction;

  showFilters();

  if (filterFormElement) {
    filterFormElement.addEventListener('click', onFilterClick);
  }

  setActiveFilter(FilterType.DEFAULT);
};

const destroyFilters = () => {
  if (filterFormElement) {
    filterFormElement.removeEventListener('click', onFilterClick);
  }

  allPhotos = [];
  renderPicturesCallback = null;
  currentFilter = FilterType.DEFAULT;
};

export { initFilters, destroyFilters, FilterType };
