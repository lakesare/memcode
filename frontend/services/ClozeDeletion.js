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

// stripHtmlTags('<p>Hello <strong>world</strong>!</p>') => 'Hello world!'
// stripHtmlTags('I <mark class="answer">love</mark> cats') => 'I love cats'
const stripHtmlTags = (content) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  return tempDiv.textContent || tempDiv.innerText || '';
};

// splitIntoTextParts('I <mark class="answer">love</mark> cats and <mark class="answer">dogs</mark>!') 
// => ['I ', 'love', ' cats and ', 'dogs', '!']
const splitIntoTextParts = (content) => {
  const parts = [];
  let lastIndex = 0;
  
  // Find all cloze deletion matches
  let match;
  const regex = new RegExp(CLOZE_ANSWER_REGEX.source, 'g'); // Create fresh regex
  
  while ((match = regex.exec(content)) !== null) {
    // Add text before the cloze deletion
    if (match.index > lastIndex) {
      const textBefore = content.slice(lastIndex, match.index);
      if (textBefore) parts.push(textBefore);
    }
    
    // Add the answer text (what should be spoken or replaced with noise)
    parts.push(match[1]);
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text after the last match
  if (lastIndex < content.length) {
    const textAfter = content.slice(lastIndex);
    if (textAfter) parts.push(textAfter);
  }
  
  return parts.filter(part => part.length > 0);
};

export default {
  getAnswerTexts,
  countAnswerBlanks,
  hideUnsolvedAnswers,
  stripHtmlTags,
  splitIntoTextParts
};
