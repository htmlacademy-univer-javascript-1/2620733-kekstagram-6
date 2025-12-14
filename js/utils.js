const ALERT_DISPLAY_TIME = 5000;

const createDebouncedFunction = (originalFunction, waitTime = 500) => {
  let timeoutId;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => originalFunction.apply(this, args), waitTime);
  };
};

const createThrottledFunction = (originalFunction, interval) => {
  let lastCallTime = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCallTime >= interval) {
      originalFunction.apply(this, args);
      lastCallTime = now;
    }
  };
};

const showAlertMessage = (messageText) => {
  const alertBox = document.createElement('div');
  alertBox.classList.add('data-error');
  alertBox.style.cssText = `
    z-index: 100;
    position: absolute;
    left: 0; top: 0; right: 0;
    padding: 10px 3px;
    font-size: 30px;
    text-align: center;
    background-color: red;
    color: white;
  `;
  alertBox.textContent = messageText;
  document.body.append(alertBox);
  window.setTimeout(() => alertBox.remove(), ALERT_DISPLAY_TIME);
};

export { createDebouncedFunction, createThrottledFunction, showAlertMessage };
