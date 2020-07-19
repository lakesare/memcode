import playSound from '~/services/playSound';
import longSound from '../../short_shimmer.mp3';

const playLongSound = (score, currentProblem) => {
  if (score === undefined || (currentProblem.type === 'separateAnswer' && score === 5)) {
    // console.error('playing long sound');
    playSound(longSound, { volume: 0.1 });
  }
};

export default playLongSound;
