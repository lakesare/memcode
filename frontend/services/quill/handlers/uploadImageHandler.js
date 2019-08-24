import toArray from '~/services/toArray';
import placeholdAndCreateImage from './services/placeholdAndCreateImage';

const uploadImageHandler = (quill, options) => {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('multiple', true);
  input.click();

  input.onchange = () => {
    toArray(input.files).forEach((file) =>
      placeholdAndCreateImage(file, quill, options)
    );
  };
};

export default uploadImageHandler;
