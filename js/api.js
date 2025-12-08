
const SERVER_URL = 'https://31.javascript.htmlacademy.pro/kekstagram';
const GET_DATA_URL = `${SERVER_URL}/data`;

const getData = async () => {
  try {
    const response = await fetch(GET_DATA_URL);

    if (response.ok !== true) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    const errorMessage = `Не удалось загрузить данные: ${error.message}`;
    throw new Error(errorMessage);
  }
};

const sendData = async (formData) => {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      body: formData,
    });

    if (response.ok !== true) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    const errorMessage = `Не удалось отправить данные: ${error.message}`;
    throw new Error(errorMessage);
  }
};

export { getData, sendData };
