const VALID_FILE_EXTENSIONS = ['jpg', 'jpeg', 'png'];

const fileInputElement = document.querySelector('#upload-file');
const mainImagePreview = document.querySelector('.img-upload__preview img');
const effectPreviews = document.querySelectorAll('.effects__preview');

const loadSelectedImage = () => {
  const selectedFile = fileInputElement.files[0];
  if (!selectedFile) {
    return;
  }
  const fileName = selectedFile.name.toLowerCase();
  const isFileTypeValid = VALID_FILE_EXTENSIONS.some((ext) => fileName.endsWith(ext));
  if (!isFileTypeValid) {
    return;
  }
  const imageUrl = window.URL.createObjectURL(selectedFile);
  mainImagePreview.src = imageUrl;
  effectPreviews.forEach((previewElement) => {
    previewElement.style.backgroundImage = `url('${imageUrl}')`;
  });
};

export { loadSelectedImage };
