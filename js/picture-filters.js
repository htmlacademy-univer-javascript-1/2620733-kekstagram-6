import { createDebouncedFunction } from './utils.js';
import { displayPhotoThumbnails } from './thumbnail-renderer.js';

const FILTER_ID = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed'
};

const RANDOM_PHOTOS_LIMIT = 10;

const filterContainer = document.querySelector('.img-filters');
let activeFilterId = FILTER_ID.DEFAULT;
let photosData = [];

const getPhotosSortedByComments = (firstPhoto, secondPhoto) => secondPhoto.comments.length - firstPhoto.comments.length;

const filterPhotos = () => {
  const photosCopy = [...photosData];
  switch (activeFilterId) {
    case FILTER_ID.RANDOM:
      return photosCopy.sort(() => Math.random() - 0.5).slice(0, RANDOM_PHOTOS_LIMIT);
    case FILTER_ID.DISCUSSED:
      return photosCopy.sort(getPhotosSortedByComments);
    default:
      return photosCopy;
  }
};

const updatePhotoGallery = () => {
  const pictures = document.querySelectorAll('.picture');
  pictures.forEach((picture) => picture.remove());
  const sortedPhotos = filterPhotos();
  displayPhotoThumbnails(sortedPhotos);
};

const updateGalleryWithDelay = createDebouncedFunction(updatePhotoGallery, 500);

const handleFilterClick = (event) => {
  const clickedButton = event.target;
  const isFilterButton = clickedButton.classList.contains('img-filters__button');
  if (!isFilterButton || clickedButton.id === activeFilterId) {
    return;
  }
  const currentActiveButton = filterContainer.querySelector('.img-filters__button--active');
  currentActiveButton.classList.remove('img-filters__button--active');
  clickedButton.classList.add('img-filters__button--active');
  activeFilterId = clickedButton.id;
  updateGalleryWithDelay();
};

const initializeFilters = (loadedPhotos) => {
  photosData = loadedPhotos;
  filterContainer.classList.remove('img-filters--inactive');
  filterContainer.addEventListener('click', handleFilterClick);
};

export { initializeFilters };
