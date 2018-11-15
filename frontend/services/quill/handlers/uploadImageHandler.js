import FileApi from '~/api/FileApi';

function uploadImageHandler() {
  const selectionAt = this.quill.getSelection().index;

  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.click();

  input.onchange = () => {
    const file = input.files[0];
    FileApi.upload(false, file)
      .then((response) => {
        this.quill.insertEmbed(selectionAt, 'image', response.url);
      });
  };
}

export default uploadImageHandler;
