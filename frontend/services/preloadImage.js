const preloadImage = (url, onLoad) => {
  const img = new Image();
  img.src = url;
  img.onload = onLoad;
};

export default preloadImage;
