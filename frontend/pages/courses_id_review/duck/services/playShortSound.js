import playSound from '~/services/playSound';
import shortMusic from '../../real_short.mp3';

const playShortSound = () => {
  // console.error('playing short sound');
  playSound(shortMusic, { volume: 0.12 });
};

export default playShortSound;
