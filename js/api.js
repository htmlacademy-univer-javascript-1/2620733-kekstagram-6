const ServerConfig = {
  ADDRESS: 'https://29.javascript.htmlacademy.pro/kekstagram',
  PATH: {
    DATA: '/data',
    POST: '/'
  },
  METHOD: {
    GET: 'GET',
    POST: 'POST'
  }
};

const ErrorMessage = {
  LOAD: 'Не удалось загрузить фотографии. Попробуйте перезагрузить страницу.',
  SEND: 'Не удалось отправить фотографию. Пожалуйста, попробуйте еще раз.'
};

const createRequest = (route, errorMessage, method = ServerConfig.METHOD.GET, payload = null) => {
  const url = `${ServerConfig.ADDRESS}${route}`;
  const options = {
    method: method,
    body: payload
  };

  return window.fetch(url, options)
    .then((serverResponse) => {
      if (!serverResponse.ok) {
        throw new Error();
      }
      return serverResponse.json();
    })
    .catch(() => {
      throw new Error(errorMessage);
    });
};

const fetchPhotos = () => createRequest(ServerConfig.PATH.DATA, ErrorMessage.LOAD);
const uploadPhoto = (formData) => createRequest(ServerConfig.PATH.POST, ErrorMessage.SEND, ServerConfig.METHOD.POST, formData);

export { fetchPhotos, uploadPhoto };
