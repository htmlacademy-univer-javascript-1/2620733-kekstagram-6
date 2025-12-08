const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;
const DEFAULT_EFFECT = 'none';
const KEY_ESCAPE = 'Escape';

const EFFECTS = Object.freeze({
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
});

const createImageEditor = () => {
  const scaleControlSmallerElement = document.querySelector('.scale__control--smaller');
  const scaleControlBiggerElement = document.querySelector('.scale__control--bigger');
  const scaleControlValueElement = document.querySelector('.scale__control--value');
  const imagePreviewElement = document.querySelector('.img-upload__preview img');

  const effectsListElement = document.querySelector('.effects__list');
  const effectLevelSliderElement = document.querySelector('.effect-level__slider');
  const effectLevelValueElement = document.querySelector('.effect-level__value');
  const effectLevelContainerElement = document.querySelector('.img-upload__effect-level');

  let currentScale = SCALE_DEFAULT;
  let currentEffect = DEFAULT_EFFECT;

  const isNoUiSliderAvailable = () => {
    return typeof window.noUiSlider !== 'undefined';
  };

  const initSlider = () => {
    if (!effectLevelSliderElement || !isNoUiSliderAvailable()) {
      console.error('Слайдер эффектов не доступен');
      return;
    }

    try {
      window.noUiSlider.create(effectLevelSliderElement, {
        range: {
          min: 0,
          max: 100
        },
        start: 100,
        step: 1,
        connect: 'lower',
        format: {
          to: (value) => {
            if (Number.isInteger(value)) {
              return value.toFixed(0);
            }
            return value.toFixed(1);
          },
          from: (value) => {
            return parseFloat(value);
          }
        }
      });

      if (effectLevelContainerElement) {
        effectLevelContainerElement.classList.add('hidden');
      }
    } catch (error) {
      console.error('Ошибка инициализации слайдера:', error);
    }
  };

  const updateSlider = (effect) => {
    if (!effectLevelSliderElement || !effectLevelSliderElement.noUiSlider) {
      return;
    }

    const effectConfig = EFFECTS[effect];
    if (!effectConfig) {
      return;
    }

    effectLevelSliderElement.noUiSlider.updateOptions({
      range: {
        min: effectConfig.min,
        max: effectConfig.max
      },
      start: effectConfig.start,
      step: effectConfig.step
    });
  };

  const applyEffect = (effect, value) => {
    if (!imagePreviewElement) {
      return;
    }

    const effectConfig = EFFECTS[effect];
    if (!effectConfig) {
      return;
    }

    if (effect === DEFAULT_EFFECT) {
      imagePreviewElement.style.filter = 'none';
      if (effectLevelContainerElement) {
        effectLevelContainerElement.classList.add('hidden');
      }
    } else {
      imagePreviewElement.style.filter = `${effectConfig.filter}(${value}${effectConfig.unit})`;
      if (effectLevelContainerElement) {
        effectLevelContainerElement.classList.remove('hidden');
      }
    }

    if (effectLevelValueElement) {
      effectLevelValueElement.value = String(value);
    }
  };

  const onSliderUpdate = () => {
    if (!effectLevelSliderElement || !effectLevelSliderElement.noUiSlider) {
      return;
    }

    const value = effectLevelSliderElement.noUiSlider.get();
    applyEffect(currentEffect, value);
  };

  const onEffectChange = (evt) => {
    const target = evt.target;

    if (target.type !== 'radio') {
      return;
    }

    const effectName = target.value;

    if (!EFFECTS[effectName]) {
      console.warn(`Неизвестный эффект: ${effectName}`);
      return;
    }

    currentEffect = effectName;

    updateSlider(currentEffect);
    applyEffect(currentEffect, EFFECTS[currentEffect].start);
  };

  const scaleImage = (value) => {
    if (value < SCALE_MIN || value > SCALE_MAX) {
      console.warn(`Недопустимое значение масштаба: ${value}`);
      return;
    }

    currentScale = value;

    if (scaleControlValueElement) {
      scaleControlValueElement.value = `${value}%`;
    }

    if (imagePreviewElement) {
      const scaleValue = value / 100;
      imagePreviewElement.style.transform = `scale(${scaleValue})`;
    }
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

    currentEffect = DEFAULT_EFFECT;

    if (effectsListElement) {
      const noneEffect = effectsListElement.querySelector('#effect-none');
      if (noneEffect) {
        noneEffect.checked = true;
      }
    }
    applyEffect(DEFAULT_EFFECT, '');
    if (effectLevelContainerElement) {
      effectLevelContainerElement.classList.add('hidden');
    }
  };

  const destroy = () => {
    if (effectLevelSliderElement && effectLevelSliderElement.noUiSlider) {
      effectLevelSliderElement.noUiSlider.destroy();
    }

    if (scaleControlSmallerElement) {
      scaleControlSmallerElement.removeEventListener('click', onScaleSmaller);
    }

    if (scaleControlBiggerElement) {
      scaleControlBiggerElement.removeEventListener('click', onScaleBigger);
    }

    if (effectsListElement) {
      effectsListElement.removeEventListener('change', onEffectChange);
    }

    if (effectLevelSliderElement) {
      effectLevelSliderElement.noUiSlider.off('update', onSliderUpdate);
    }
  };

  const init = () => {
    if (!imagePreviewElement) {
      console.error('Элемент превью изображения не найден');
      return;
    }

    try {
      if (effectLevelSliderElement) {
        initSlider();
        effectLevelSliderElement.noUiSlider.on('update', onSliderUpdate);
      }

      if (scaleControlSmallerElement) {
        scaleControlSmallerElement.addEventListener('click', onScaleSmaller);
      }

      if (scaleControlBiggerElement) {
        scaleControlBiggerElement.addEventListener('click', onScaleBigger);
      }

      if (effectsListElement) {
        effectsListElement.addEventListener('change', onEffectChange);
      }

      resetEditor();
    } catch (error) {
      console.error('Ошибка инициализации редактора изображений:', error);
    }
  };

  return {
    init,
    reset: resetEditor,
    destroy
  };
};

const imageEditor = createImageEditor();

export default imageEditor;
