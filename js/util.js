export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getUniqueNumbers(count, min, max) {
    const numbers = [];
    while (numbers.length < count) {
        const num = getRandomInt(min, max);
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }
    return numbers;
}

export function debounce(callback, timeoutDelay = 500) {
    let timeoutId;

    return (...rest) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
    };
}

export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function getRandomElements(array, count) {
    if (array.length <= count) {
        return shuffleArray(array);
    }

    const shuffled = shuffleArray(array);
    return shuffled.slice(0, count);
}

export function isEscapeKey(evt) {
    return evt.key === 'Escape' || evt.key === 'Esc' || evt.keyCode === 27;
}

export function isEnterKey(evt) {
    return evt.key === 'Enter' || evt.keyCode === 13;
}
