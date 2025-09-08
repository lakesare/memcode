import SequenceTtsService from '~/services/SequenceTtsService';

// Helper function to check if volume is enabled
const isVolumeEnabled = () => {
  return localStorage.getItem('volume') === 'yes';
};

const playAutoTts = (problem) => {
  // Only auto-read if volume is enabled and problem exists
  if (isVolumeEnabled() && problem) {
    if (problem.type === 'inlinedAnswers') {
      // Don't auto-read cloze deletion problems - let user start when ready
      // The sequence will play when they complete answers or manually trigger it
      return;
    } else if (problem.type === 'separateAnswer') {
      // For separate answer problems, only read the question (content), never the answer
      SequenceTtsService.playFullText(problem.content.content);
    }
  }
};

export default playAutoTts;
