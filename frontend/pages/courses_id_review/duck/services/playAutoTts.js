import TtsService from '~/services/ttsService';
import ClozeDeletion from '~/services/ClozeDeletion';

// Helper function to check if volume is enabled
const isVolumeEnabled = () => {
  return localStorage.getItem('volume') === 'yes';
};

const playAutoTts = (problem) => {
  // Only auto-read if volume is enabled and problem exists
  if (isVolumeEnabled() && problem) {
    if (problem.type === 'inlinedAnswers') {
      // Hide answers for automatic reading - user shouldn't hear the answers yet
      const contentWithHiddenAnswers = ClozeDeletion.hideUnsolvedAnswers(problem.content.content, []);
      TtsService.speakText(contentWithHiddenAnswers);
    } else if (problem.type === 'separateAnswer') {
      // For separate answer problems, only read the question (content), never the answer
      TtsService.speakText(problem.content.content);
    }
  }
};

export default playAutoTts;
