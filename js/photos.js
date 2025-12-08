const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

const uploadFile = document.querySelector('#upload-file');
const preview = document.querySelector('.img-upload__preview img');
const effectList = document.querySelector('.effects__list');
const smallImages = effectList.querySelectorAll('span');

const onUploadImageChange = () => {
  const file = uploadFile.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (matches) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      preview.src = reader.result;
      smallImages.forEach((evt) => {
        evt.style.backgroundImage = `url(${reader.result})`;
      });
    });
    reader.readAsDataURL(file);
  }
};

uploadFile.addEventListener('change', onUploadImageChange);
