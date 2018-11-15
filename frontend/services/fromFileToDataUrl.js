const fromFileToDataUrl = (file, onload) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    onload(e.target.result);
  };
  reader.readAsDataURL(file);
};

export default fromFileToDataUrl;
