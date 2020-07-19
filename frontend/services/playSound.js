const playSound = (path, { volume = 1 } = {}) => {
  if (localStorage.getItem('volume') === 'yes' && window.Audio) {
    const audio = new Audio(path);
    audio.volume = volume;
    audio.play();
  }
};

export default playSound;
