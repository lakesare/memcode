// @content '<p>I <mark class="answer">love</mark> you <mark class="answer">more</mark></p>'
// => matchedStrings ["<mark class="answer">love</mark>", "<mark class="answer">more</mark>"]
const amountOfAnswerInputsInProblem = (problem) => {
  const matchedStrings = problem.content.content.match(/<mark class="answer">(.*?)<\/mark>/g);
  if (matchedStrings === null) {
    return 0;
  } else {
    return matchedStrings.length;
  }
};

export default amountOfAnswerInputsInProblem;
