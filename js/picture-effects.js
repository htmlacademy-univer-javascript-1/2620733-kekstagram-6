const effectSettings = {
  none: { filter: 'none', min: 0, max: 100, step: 1, unit: '', cssClass: 'effects__preview--none' },
  chrome: { filter: 'grayscale', min: 0, max: 1, step: 0.1, unit: '', cssClass: 'effects__preview--chrome' },
  sepia: { filter: 'sepia', min: 0, max: 1, step: 0.1, unit: '', cssClass: 'effects__preview--sepia' },
  marvin: { filter: 'invert', min: 0, max: 100, step: 1, unit: '%', cssClass: 'effects__preview--marvin' },
  phobos: { filter: 'blur', min: 0, max: 3, step: 0.1, unit: 'px', cssClass: 'effects__preview--phobos' },
  heat: { filter: 'brightness', min: 1, max: 3, step: 0.1, unit: '', cssClass: 'effects__preview--heat' }
};

const DEFAULT_EFFECT_KEY = 'none';
let activeEffect = effectSettings[DEFAULT_EFFECT_KEY];

const imagePreview = document.querySelector('.img-upload__preview img');
const effectsListContainer = document.querySelector('.effects');
const effectSliderElement = document.querySelector('.effect-level__slider');
const sliderWrapper = document.querySelector('.img-upload__effect-level');
const effectValueField = document.querySelector('.effect-level__value');

const isDefaultEffect = () => activeEffect.filter === 'none';

const setupSlider = () => {
  effectSliderElement.noUiSlider.updateOptions({
    range: { min: activeEffect.min, max: activeEffect.max },
    start: activeEffect.max,
    step: activeEffect.step
  });
  sliderWrapper.classList.toggle('hidden', isDefaultEffect());
};

const onEffectChange = (event) => {
  if (!event.target.classList.contains('effects__radio')) {
    return;
  }
  const selectedEffectKey = event.target.value;
  activeEffect = effectSettings[selectedEffectKey];
  imagePreview.className = activeEffect.cssClass;
  setupSlider();
};

const onSliderMove = () => {
  const sliderCurrentValue = effectSliderElement.noUiSlider.get();
  const normalizedValue = parseFloat(sliderCurrentValue).toString();
  effectValueField.value = normalizedValue;
  if (isDefaultEffect()) {
    imagePreview.style.filter = '';
    return;
  }
  imagePreview.style.filter = `${activeEffect.filter}(${normalizedValue}${activeEffect.unit})`;
};

const restoreDefaultEffect = () => {
  activeEffect = effectSettings[DEFAULT_EFFECT_KEY];
  setupSlider();
};

window.noUiSlider.create(effectSliderElement, {
  range: { min: activeEffect.min, max: activeEffect.max },
  start: activeEffect.max,
  step: activeEffect.step,
  connect: 'lower'
});
setupSlider();

effectsListContainer.addEventListener('change', onEffectChange);
effectSliderElement.noUiSlider.on('update', onSliderMove);

export { restoreDefaultEffect };
