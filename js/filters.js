import { debounce } from './util.js';
import thumbnailRenderer from './big-picture.js';

const PICTURES_COUNT = 10;
const Filter = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed',
};

const filterElement = document.querySelector('.img-filters');
let currentFilter = Filter.DEFAULT;
let pictures = [];

const sortRandom = () => Math.random() - 0.5;

const sortDiscussed = (pictureA, pictureB) =>
  pictureB.comments.length - pictureA.comments.length;

function getFilteredPictures() {
  switch (currentFilter) {
    case Filter.RANDOM:
      return [...pictures].sort(sortRandom).slice(0, PICTURES_COUNT);
    case Filter.DISCUSSED:
      return [...pictures].sort(sortDiscussed);
    default:
      return [...pictures];
  }
}

function removePictures() {
  const pictureElements = document.querySelectorAll('.picture');
  pictureElements.forEach((element) => element.remove());
}

const renderPictures = () => {
  removePictures();
  const filteredPictures = getFilteredPictures();
  thumbnailRenderer.renderThumbnails(filteredPictures);
};

const debouncedRenderPictures = debounce(renderPictures);

function onFilterChange(evt) {
  const target = evt.target;
  if (!target.classList.contains('img-filters__button') || target.id === currentFilter) {
    return;
  }

  filterElement.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
  target.classList.add('img-filters__button--active');

  currentFilter = target.id;
  debouncedRenderPictures();
}

function initFilter(loadedPictures) {
  pictures = loadedPictures;
  filterElement.classList.remove('img-filters--inactive');
  filterElement.addEventListener('click', onFilterChange);
}

export { initFilter };
