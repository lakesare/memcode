
function handlerUploadImage() {
  console.log('HANDLING IMAGE!!!');
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.click();

  // Listen upload local image and save to server
  input.onchange = () => {
    const file = input.files[0];

    // file type is only image.
    if (/^image\//.test(file.type)) {
      apiSave(file)
        .then((url) => {
          const range = this.quill.getSelection();
          this.quill.insertEmbed(range.index, 'image', url);
        });
    } else {
      console.warn('You could only upload images.');
    }
  };
}

function apiSave(file) {
  const fd = new FormData();
  fd.append('image', file);

  // fetch('POST', 'http://localhost:3000/upload/image')
  return Promise.resolve('https://media.cntraveler.com/photos/5ab3b36ebe28d60dd24d0000/master/w_820,c_limit/morgan-library-cr-courtesy.jpg');
}

export default handlerUploadImage;
