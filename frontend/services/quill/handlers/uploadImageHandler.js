import toArray from '~/services/toArray';
import placeholdAndCreateImage from './services/placeholdAndCreateImage';
// import fromFileToDataUrl from '~/services/fromFileToDataUrl';

function uploadImageHandler() {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('multiple', true);
  input.click();

  input.onchange = () => {
    toArray(input.files).forEach((file) =>
      placeholdAndCreateImage(this.quill, file)
    );
  };
}

export default uploadImageHandler;
