import placeholdAndCreateImage from './services/placeholdAndCreateImage';

function dropOrPasteImageHandler(file, quill) {
  placeholdAndCreateImage(quill, file);
}

export default dropOrPasteImageHandler;
