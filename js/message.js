const SHOW_TIME = 5000;

import {loadData} from './api.js';
import {showAlert} from './util.js';
import {renderPictures} from './pictures.js';
import './slider.js';
import './hashtags.js';
import {initEffects} from './actions.js';
import './filters.js';
import './photos.js';
import './messages.js';

initEffects();
let photos = [];

const onSuccess = (data) => {
  photos = data.slice();
  renderPictures(photos);
  document.querySelector('.img-filters').classList.remove('img-filters--inactive');
};

const onFail = () => {
  showAlert('Ошибка загрузки', SHOW_TIME);
};

loadData(onSuccess, onFail);

export {photos};
