const CLOZE_ANSWER_REGEX = /<mark class="answer">(.*?)<\/mark>/g;
const CLOZE_ANSWER_FULL_REGEX = /<mark class="answer">[^<]*<\/mark>/g;
const PLACEHOLDER = '... ffffffffff... ';

// getAnswerTexts('I <mark class="answer">love</mark> cats') => ['love']
// getAnswerTexts('My <mark class="answer">name</mark> is <mark class="answer">John</mark>') => ['name', 'John']
const getAnswerTexts = (content) => {
  const matches = content.match(CLOZE_ANSWER_REGEX);
  if (!matches) return [];

  return matches.map(match => {
    const answerMatch = match.match(/<mark class="answer">(.*?)<\/mark>/);
    return answerMatch ? answerMatch[1] : '';
  }).filter(answer => answer.length > 0);
};

// countAnswerBlanks('I <mark class="answer">love</mark> cats') => 1
// countAnswerBlanks('My <mark class="answer">name</mark> is <mark class="answer">John</mark>') => 2
const countAnswerBlanks = (content) => {
  const matches = content.match(CLOZE_ANSWER_FULL_REGEX);
  return matches ? matches.length : 0;
};

// hideUnsolvedAnswers('I <mark class="answer">love</mark> cats', [rightInput]) => 'I love cats'
// hideUnsolvedAnswers('My <mark class="answer">name</mark> is <mark class="answer">John</mark>', [wrongInput, rightInput]) => 'My ... ffffffffff...  is John'
const hideUnsolvedAnswers = (content, answerInputs) => {
  if (!answerInputs || answerInputs.length === 0) {
    // No inputs - hide all answers
    return content.replace(CLOZE_ANSWER_FULL_REGEX, PLACEHOLDER);
  }

  let replacementIndex = 0;
  return content.replace(CLOZE_ANSWER_REGEX, (match, originalAnswer) => {
    if (replacementIndex < answerInputs.length) {
      const input = answerInputs[replacementIndex];
      const answeredState = input.getAttribute('data-answered');
      
      if (answeredState === 'right') {
        // Show what they typed correctly
        const replacement = input.value || originalAnswer;
        replacementIndex++;
        return replacement;
      } else {
        // Hide unsolved answers
        replacementIndex++;
        return PLACEHOLDER;
      }
    }
    replacementIndex++;
    return PLACEHOLDER;
  });
};

export default {
  getAnswerTexts,
  countAnswerBlanks,
  hideUnsolvedAnswers
};
