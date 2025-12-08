import { debounce, getRandomElements } from './util.js';

const FilterType = {
    DEFAULT: 'default',
    RANDOM: 'random',
    DISCUSSED: 'discussed'
};

const RANDOM_PHOTOS_COUNT = 10;

const filtersContainer = document.querySelector('.img-filters');
const filterForm = document.querySelector('.img-filters__form');
const picturesContainer = document.querySelector('.pictures');

let currentFilter = FilterType.DEFAULT;
let allPhotos = [];

const getRandomPhotos = (photos) => {
    return getRandomElements(photos, RANDOM_PHOTOS_COUNT);
};

const getDiscussedPhotos = (photos) => {
    return [...photos].sort((a, b) => b.comments.length - a.comments.length);
};

const applyFilter = (photos, filterType) => {
    switch (filterType) {
        case FilterType.RANDOM:
            return getRandomPhotos(photos);
        case FilterType.DISCUSSED:
            return getDiscussedPhotos(photos);
        case FilterType.DEFAULT:
        default:
            return [...photos];
    }
};

const showFilters = () => {
    if (filtersContainer) {
        filtersContainer.classList.remove('img-filters--inactive');
    }
};

const setActiveFilter = (filterType) => {
    currentFilter = filterType;

    const activeButtonClass = 'img-filters__button--active';
    const buttons = filterForm.querySelectorAll('.img-filters__button');

    buttons.forEach((button) => {
        button.classList.remove(activeButtonClass);

        if (button.id === `filter-${filterType}`) {
            button.classList.add(activeButtonClass);
        }
    });
};

const updateDisplayWithDebounce = debounce((photos, renderFunction) => {
    updatePhotosDisplay(photos, renderFunction);
}, 500);

const updatePhotosDisplay = (photos, renderFunction) => {
    if (!picturesContainer || !renderFunction) return;

    picturesContainer.classList.add('updating');

    const filteredPhotos = applyFilter(photos, currentFilter);

    const oldPictures = picturesContainer.querySelectorAll('.picture');
    oldPictures.forEach((picture) => picture.remove());

    renderFunction(filteredPhotos);

    setTimeout(() => {
        picturesContainer.classList.remove('updating');
    }, 300);
};

const onFilterClick = (evt) => {
    const button = evt.target.closest('.img-filters__button');

    if (!button || button.classList.contains('img-filters__button--active')) {
        return;
    }

    const filterType = button.id.replace('filter-', '');

    setActiveFilter(filterType);

    updateDisplayWithDebounce(allPhotos, window.renderPicturesCallback);
};

const initFilters = (photos, renderFunction) => {
    if (!photos || photos.length === 0) return;

    allPhotos = photos;
    window.renderPicturesCallback = renderFunction;

    showFilters();

    if (filterForm) {
        filterForm.addEventListener('click', onFilterClick);
    }

    setActiveFilter(FilterType.DEFAULT);
};

export { initFilters, FilterType };
