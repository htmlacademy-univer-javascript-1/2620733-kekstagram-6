const SCALE_INCREMENT = 25;
const MIN_SCALE_PERCENT = 25;
const MAX_SCALE_PERCENT = 100;
const DEFAULT_SCALE_PERCENT = 100;

const scaleDownButton = document.querySelector('.scale__control--smaller');
const scaleUpButton = document.querySelector('.scale__control--bigger');
const scaleValueInput = document.querySelector('.scale__control--value');
const imageToScale = document.querySelector('.img-upload__preview img');

const applyImageScale = (percentValue) => {
  const scaleFactor = percentValue / 100;
  imageToScale.style.transform = `scale(${scaleFactor})`;
  scaleValueInput.value = `${percentValue}%`;
};

const onScaleDownClick = () => {
  const currentPercent = parseInt(scaleValueInput.value, 10);
  let newPercent = currentPercent - SCALE_INCREMENT;
  if (newPercent < MIN_SCALE_PERCENT) {
    newPercent = MIN_SCALE_PERCENT;
  }
  applyImageScale(newPercent);
};

const onScaleUpClick = () => {
  const currentPercent = parseInt(scaleValueInput.value, 10);
  let newPercent = currentPercent + SCALE_INCREMENT;
  if (newPercent > MAX_SCALE_PERCENT) {
    newPercent = MAX_SCALE_PERCENT;
  }
  applyImageScale(newPercent);
};

const restoreImageScale = () => applyImageScale(DEFAULT_SCALE_PERCENT);

scaleDownButton.addEventListener('click', onScaleDownClick);
scaleUpButton.addEventListener('click', onScaleUpClick);

export { restoreImageScale };
