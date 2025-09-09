import TtsService from '~/services/ttsService';

const playAutoTts = (problem) => {
  // Only auto-read if volume is enabled and problem exists
  if (TtsService.isVolumeEnabled() && problem) {
    if (problem.type === 'inlinedAnswers') {
      // Don't auto-read cloze deletion problems - let user start when ready
      // The sequence will play when they complete answers or manually trigger it
      return;
    } else if (problem.type === 'separateAnswer') {
      // For separate answer problems, only read the question (content), never the answer
      TtsService.playFullText(problem.content.content);
    }
  }
};

export default playAutoTts;
