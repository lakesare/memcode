// input: "<h1></h1>"

// output: "text: ['<h1>first answer is ', null, ', </h1> anonymous functions in ruby are called <pre><code class="ruby"> ', null, '</code></pre>'],
// answers: [
//   { answer: 'hi' },
//   { answer: 'hello' }
// ]"
const problemContentFromParamsToDb = (content) => {
  let text = [];
  let answers = []

  let contentRemaining = content;

  while (contentRemaining.length > 0) {
    const nextSubstringOfProblemParsed = findNextAnswer(contentRemaining);
    text.push(nextSubstringOfProblemParsed.textPiece);
    if (nextSubstringOfProblemParsed.answer !== null) {
      answers.push({ answer: nextSubstringOfProblemParsed.answer });
      text.push(null);
    }
    contentRemaining = nextSubstringOfProblemParsed.newContentRemaining;
  }

  return JSON.stringify({ answers, text })
}

const findNextAnswer = (contentRemaining) => {
  const answerOpens  = contentRemaining.indexOf("<answer>");
  const answerCloses = contentRemaining.indexOf("</answer>");

  const { textPiece, answer, newContentRemaining } = (answerOpens === -1) ?
    {
      textPiece:        contentRemaining,
      answer:           null,
      newContentRemaining: '',
    } : 
    {
      textPiece:        contentRemaining.slice(0, answerOpens),
      answer:           contentRemaining.slice(answerOpens + "<answer>".length, answerCloses),
      newContentRemaining: contentRemaining.slice(answerCloses + "</answer>".length),
    }

  return { textPiece, answer, newContentRemaining }
}

export { problemContentFromParamsToDb };