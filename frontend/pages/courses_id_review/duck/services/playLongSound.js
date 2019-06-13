import longSound from '../../shimmer.mp3';

const playLongSound = (score, currentProblem) => {
  if (score === 5) {
    if (localStorage.getItem('volume') === 'yes') {
      const audio = new Audio(longSound);
      audio.volume = 0.1;
      audio.play();
    }
  }
};

export default playLongSound;
