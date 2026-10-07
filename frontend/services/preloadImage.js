const preloadImage = (url, onLoad) => {
  const img = new Image();
  img.src = url;
  img.onload = () => onLoad(img);
  img.onerror = () => onLoad(img);
};

export default preloadImage;
