import fromDataUrlToBlob from '~/services/fromDataUrlToBlob';
import FileApi from '~/api/FileApi';

function dropOrPasteImageHandler(dataUrl, quill) {
  const selectionAt = quill.getSelection().index;

  // blob's fine
  const file = fromDataUrlToBlob(dataUrl);
  FileApi.upload(false, file)
    .then((response) => {
      quill.insertEmbed(selectionAt, 'image', response.url);
    });
}

export default dropOrPasteImageHandler;
