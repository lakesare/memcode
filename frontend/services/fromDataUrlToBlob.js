// ___Where is this taken from?
//    Entirely from https://stackoverflow.com/a/30407840/3192470.
function fromDataUrlToBlob(dataurl) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}

export default fromDataUrlToBlob;
