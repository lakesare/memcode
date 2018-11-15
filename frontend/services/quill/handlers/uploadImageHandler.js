import toArray from '~/services/toArray';
import FileApi from '~/api/FileApi';

function uploadImageHandler() {
  const selectionAt = this.quill.getSelection().index;

  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('multiple', true);
  input.click();

  input.onchange = () => {
    toArray(input.files).forEach((file) =>
      FileApi.upload(false, file)
        .then((response) => {
          this.quill.insertEmbed(selectionAt, 'image', response.url);
        })
    );
  };
}

export default uploadImageHandler;
