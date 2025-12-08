const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const fileInput = document.querySelector('#upload-file');
const preview = document.querySelector('.img-upload__preview img');
const effectsPreviews = document.querySelectorAll('.effects__preview');

const initUploadImage = () => {
  const file = fileInput.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (matches) {
    const url = URL.createObjectURL(file);
    preview.src = url;
    effectsPreviews.forEach((item) => {
      item.style.backgroundImage = `url(${url})`;
    });
  }
};

export { initUploadImage };
