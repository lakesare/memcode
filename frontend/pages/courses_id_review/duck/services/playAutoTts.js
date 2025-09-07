import SequenceTtsService from '~/services/SequenceTtsService';

// Helper function to check if volume is enabled
const isVolumeEnabled = () => {
  return localStorage.getItem('volume') === 'yes';
};

const playAutoTts = (problem) => {
  // Only auto-read if volume is enabled and problem exists
  if (isVolumeEnabled() && problem) {
    if (problem.type === 'inlinedAnswers') {
      // Play sequence with noise for missing answers - user shouldn't hear the answers yet
      SequenceTtsService.playSequence(problem.content.content, null);
    } else if (problem.type === 'separateAnswer') {
      // For separate answer problems, only read the question (content), never the answer
      SequenceTtsService.playFullText(problem.content.content);
    }
  }
};

export default playAutoTts;
