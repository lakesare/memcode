import shortMusic from '../../short_shimmer.mp3';

const playShortSound = () => {
  console.log('playing short sound');
  if (localStorage.getItem('volume') === 'yes') {
    const audio = new Audio(shortMusic);
    audio.volume = 0.1;
    audio.play();
  }
};

export default playShortSound;
