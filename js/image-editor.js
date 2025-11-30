const imageEditor = (function() {
  const scaleControlSmaller = document.querySelector('.scale__control--smaller');
  const scaleControlBigger = document.querySelector('.scale__control--bigger');
  const scaleControlValue = document.querySelector('.scale__control--value');
  const imagePreview = document.querySelector('.img-upload__preview img');

  const effectsList = document.querySelector('.effects__list');
  const effectLevelSlider = document.querySelector('.effect-level__slider');
  const effectLevelValue = document.querySelector('.effect-level__value');
  const effectLevelContainer = document.querySelector('.img-upload__effect-level');

  const SCALE_STEP = 25;
  const SCALE_MIN = 25;
  const SCALE_MAX = 100;
  const SCALE_DEFAULT = 100;

  let currentScale = SCALE_DEFAULT;
  let currentEffect = 'none';


  const effects = {
    none: {
      filter: 'none',
      unit: '',
      min: 0,
      max: 100,
      step: 1,
      start: 100
    },
    chrome: {
      filter: 'grayscale',
      unit: '',
      min: 0,
      max: 1,
      step: 0.1,
      start: 1
    },
    sepia: {
      filter: 'sepia',
      unit: '',
      min: 0,
      max: 1,
      step: 0.1,
      start: 1
    },
    marvin: {
      filter: 'invert',
      unit: '%',
      min: 0,
      max: 100,
      step: 1,
      start: 100
    },
    phobos: {
      filter: 'blur',
      unit: 'px',
      min: 0,
      max: 3,
      step: 0.1,
      start: 3
    },
    heat: {
      filter: 'brightness',
      unit: '',
      min: 1,
      max: 3,
      step: 0.1,
      start: 3
    }
  };

  const initSlider = () => {
    noUiSlider.create(effectLevelSlider, {
      range: {
        min: 0,
        max: 100
      },
      start: 100,
      step: 1,
      connect: 'lower',
      format: {
        to: function (value) {
          if (Number.isInteger(value)) {
            return value.toFixed(0);
          }
          return value.toFixed(1);
        },
        from: function (value) {
          return parseFloat(value);
        }
      }
    });

    effectLevelContainer.classList.add('hidden');
  };

  const updateSlider = (effect) => {
    const effectConfig = effects[effect];

    effectLevelSlider.noUiSlider.updateOptions({
      range: {
        min: effectConfig.min,
        max: effectConfig.max
      },
      start: effectConfig.start,
      step: effectConfig.step
    });
  };

  const applyEffect = (effect, value) => {
    const effectConfig = effects[effect];

    if (effect === 'none') {
      imagePreview.style.filter = 'none';
      effectLevelContainer.classList.add('hidden');
    } else {
      imagePreview.style.filter = `${effectConfig.filter}(${value}${effectConfig.unit})`;
      effectLevelContainer.classList.remove('hidden');
    }

    effectLevelValue.value = value;
  };

  const onSliderUpdate = () => {
    const value = effectLevelSlider.noUiSlider.get();
    applyEffect(currentEffect, value);
  };

  const onEffectChange = (evt) => {
    if (evt.target.matches('input[type="radio"]')) {
      currentEffect = evt.target.value;

      updateSlider(currentEffect);
      applyEffect(currentEffect, effects[currentEffect].start);
    }
  };

  const scaleImage = (value) => {
    currentScale = value;
    scaleControlValue.value = `${value}%`;
    imagePreview.style.transform = `scale(${value / 100})`;
  };

  const onScaleSmaller = () => {
    const newScale = Math.max(currentScale - SCALE_STEP, SCALE_MIN);
    scaleImage(newScale);
  };

  const onScaleBigger = () => {
    const newScale = Math.min(currentScale + SCALE_STEP, SCALE_MAX);
    scaleImage(newScale);
  };

  const resetEditor = () => {
    scaleImage(SCALE_DEFAULT);

    currentEffect = 'none';
    const noneEffect = effectsList.querySelector('#effect-none');
    if (noneEffect) {
      noneEffect.checked = true;
    }

    applyEffect('none', '');
    effectLevelContainer.classList.add('hidden');
  };

  const init = () => {
    if (effectLevelSlider) {
      initSlider();
      effectLevelSlider.noUiSlider.on('update', onSliderUpdate);
    }

    if (scaleControlSmaller) {
      scaleControlSmaller.addEventListener('click', onScaleSmaller);
    }

    if (scaleControlBigger) {
      scaleControlBigger.addEventListener('click', onScaleBigger);
    }

    if (effectsList) {
      effectsList.addEventListener('change', onEffectChange);
    }

    resetEditor();
  };

  return {
    init,
    reset: resetEditor
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  imageEditor.init();
});
