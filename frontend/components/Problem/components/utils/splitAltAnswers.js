// If data-answer is 'red|crimson' - then 'red', 'crimson' are both the right answers
// If data-answer is 'red\|crimson' - then 'red|crimson' is the right answer
//
// This does work when we get the answer from the input, but won't work if we declare the spring via quotation marks.
// So use String.raw`` when testing this function.
// splitAltAnswers(String.raw`wow\|right|hello`) => ['wow|right', 'hello']
const splitAltAnswers = (answers) => {
  const escapedAnswers = answers.replaceAll('\\\|', '___escaped_pipe___');
  const splitAnswers = escapedAnswers.split('|');
  return splitAnswers.map((answer) => answer.replace(/___escaped_pipe___/g, '|'));
};


export default splitAltAnswers;
