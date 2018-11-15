function handlerDropOrPasteImage(dataUrl, type, quill) {
  console.log('INSERT IMAGE!!!');
  // Listen upload local image and save to server

  apiSave('file')
    .then((url) => {
      const range = quill.getSelection();
      quill.insertEmbed(range.index, 'image', url);
    });
}


function apiSave(file) {
  const fd = new FormData();
  fd.append('image', file);

  // fetch('POST', 'http://localhost:3000/upload/image')
  return Promise.resolve('https://media.cntraveler.com/photos/5ab3b36ebe28d60dd24d0000/master/w_820,c_limit/morgan-library-cr-courtesy.jpg');
}

export default handlerDropOrPasteImage;
