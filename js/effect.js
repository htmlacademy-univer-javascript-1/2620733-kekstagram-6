const EFFECTS = {
  none: {
    style: 'none',
    min: 0,
    max: 100,
    step: 1,
    unit: '',
  },
  chrome: {
    style: 'grayscale',
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
  },
  sepia: {
    style: 'sepia',
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
  },
  marvin: {
    style: 'invert',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
  },
  phobos: {
    style: 'blur',
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px',
  },
  heat: {
    style: 'brightness',
    min: 1,
    max: 3,
    step: 0.1,
    unit: '',
  },
};

const DEFAULT_EFFECT = EFFECTS.none;
let chosenEffect = DEFAULT_EFFECT;

const imageElement = document.querySelector('.img-upload__preview img');
const effectsElement = document.querySelector('.effects');
const sliderElement = document.querySelector('.effect-level__slider');
const sliderContainerElement = document.querySelector('.img-upload__effect-level');
const effectLevelElement = document.querySelector('.effect-level__value');

function isDefault() {
  return chosenEffect === DEFAULT_EFFECT;
}

function updateSlider() {
  sliderElement.noUiSlider.updateOptions({
    range: {
      min: chosenEffect.min,
      max: chosenEffect.max,
    },
    start: chosenEffect.max,
    step: chosenEffect.step,
  });

  if (isDefault()) {
    sliderContainerElement.classList.add('hidden');
  } else {
    sliderContainerElement.classList.remove('hidden');
  }
}

function onEffectsChange(evt) {
  if (!evt.target.classList.contains('effects__radio')) {
    return;
  }
  chosenEffect = EFFECTS[evt.target.value];
  imageElement.className = `effects__preview--${evt.target.value}`;
  updateSlider();
}

function onSliderUpdate() {
  const sliderValue = sliderElement.noUiSlider.get();
  if (isDefault()) {
    imageElement.style.filter = DEFAULT_EFFECT.style;
    effectLevelElement.value = '';
  } else {
    imageElement.style.filter = `${chosenEffect.style}(${sliderValue}${chosenEffect.unit})`;
    effectLevelElement.value = parseFloat(sliderValue);
  }
}

function resetEffects() {
  chosenEffect = DEFAULT_EFFECT;
  updateSlider();
}

noUiSlider.create(sliderElement, {
  range: {
    min: DEFAULT_EFFECT.min,
    max: DEFAULT_EFFECT.max,
  },
  start: DEFAULT_EFFECT.max,
  step: DEFAULT_EFFECT.step,
  connect: 'lower',
});
updateSlider();

effectsElement.addEventListener('change', onEffectsChange);
sliderElement.noUiSlider.on('update', onSliderUpdate);

export { resetEffects };
