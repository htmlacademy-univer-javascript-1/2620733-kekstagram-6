const SERVER_URL = 'https://31.javascript.htmlacademy.pro/kekstagram';

export const getData = async () => {
    try {
        const response = await fetch(`${SERVER_URL}/data`);

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(`Не удалось загрузить данные: ${error.message}`);
    }
};

export const sendData = async (formData) => {
    try {
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(`Не удалось отправить данные: ${error.message}`);
    }
};
