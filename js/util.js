const DELAY = 500;

const randomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));

  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const checkLenght = (inputString, maxLenght) => inputString.length <= maxLenght;
const Keys = {
  ESCAPE: 'Escape',
  ESC: 'Esc'
};

const isEscapeKey = (evt) => evt.key === Keys.ESCAPE || evt.key === Keys.ESC;

const closeOnEscKeyDown = (evt, cb) => {
  if (isEscapeKey(evt)) {
    cb();
  }
};

const debounce = (cb) => {
  let lastTimeOut = null;

  return (...args) =>{
    if (lastTimeOut){
      window.clearTimeout(lastTimeOut);
    }
    lastTimeOut = window.setTimeout(()=>{
      cb(...args);
    }, DELAY);
  };
};

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
const showAlert = (message, alertShowTime) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = '100';
  alertContainer.style.position = 'absolute';
  alertContainer.style.left = '0';
  alertContainer.style.top = '0';
  alertContainer.style.right = '0';
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '30px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = '#f5cc00';

  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => alertContainer.remove(), alertShowTime);
};

export {randomInteger, closeOnEscKeyDown, isEscapeKey, showAlert, checkLenght, debounce, shuffleArray};
