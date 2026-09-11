import placeholdAndCreateImage from './services/placeholdAndCreateImage';

function dropOrPasteImageHandler(file, quill, options) {
  placeholdAndCreateImage(file, quill, options);
}

export default dropOrPasteImageHandler;
