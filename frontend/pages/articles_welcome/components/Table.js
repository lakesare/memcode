
const Table = () =>
  <table>
    <thead>
      <tr>
        <th/>
        <th><a href="http://www.memcode.com">Memcode</a></th>
        <th><a href="http://www.memrise.com">Memrise</a></th>
        <th><a href="http://www.codequizzes.com/">CodeQuizzes</a></th>
        <th><a href="https://quizlet.com">Quizlet</a></th>
        <th><a href="https://www.brainscape.com/">Brainscape</a></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>Types of flashcards</th>
        {/* memcode */}
        <td>
          1. You fill in answer in a sentence, and it's automatically checked
          <br/>
          2. You give an answer to some question, and manually compare it to the original.
        </td>
        {/* memrise */}
        <td>You see a question, you type in an in a separate box answer, and it's checked automatically.</td>
        {/* codequizzes */}
        <td>You see a question, you give an answer and manually compare it.</td>
        {/* quizlet */}
        <td>== Memrise</td>
        {/* brainscape */}
        <td>You see a question, you give an answer and manually compare it, and manually rate your performance 1-5.</td>
      </tr>
      <tr>
        <th>Learning algorithm</th>
        {/* memcode */}
        <td>SM2</td>
        {/* memrise */}
        <td>SM2</td>
        {/* codequizzes */}
        <td>None. Your progress is not recorded, and you are not asked to review flashcards.</td>
        {/* quizlet */}
        <td>Basic: either know or don't know.</td>
        {/* brainscape */}
        <td>SM2</td>
      </tr>
      <tr>
        <th>Formatting in a flashcard</th>
        {/* memcode */}
        <td>Yes. Images, code snippets with inputs for answers inside, bold text.</td>
        {/* memrise */}
        <td>No</td>
        {/* codequizzes */}
        <td>No, and not possible to create own flashcards.</td>
        {/* quizlet */}
        <td>No</td>
        {/* brainscape */}
        <td>Yes, in the paid mode.</td>
      </tr>
      <tr>
        <th>Amount and quality of courses</th>
        {/* memcode */}
        <td>None</td>
        {/* memrise */}
        <td>Large amount, good quality for languages.</td>
        {/* codequizzes */}
        <td>Small amount of courses on programming, but with perfect quality. They are curated by github community.</td>
        {/* quizlet */}
        <td>Large amount, good quality.</td>
        {/* brainscape */}
        <td>Large amount, great quality (manually selected by experts) for the paid ones.</td>
      </tr>
    </tbody>
  </table>;

export { Table };
