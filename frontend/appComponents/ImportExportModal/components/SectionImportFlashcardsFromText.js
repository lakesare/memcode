import api from '~/api';
import Loading from '~/components/Loading';

const instructionsForLLM = `<instructions>
Your task is to create flashcards for the spaced-repetition app.
This website has two types of flashcards: "cloze-deletion" flashcards where the user has to input the word in a sentence, and "question-answer" flashcards (traditional flashcard structure where user has to answer a question).
To create a "cloze-deletion" flashcard, you should write a sentence, and insert <mark class="answer">...some string...</mark> into that sentence. "...some string..." automatically gets parsed as a correct answer in such a case. The second column of a "cloze-deletion" flashcard is always visible to the user, and we use it to give them some hints.
For example, here is a typical "cloze-deletion" flashcard for a german-learning course:
<example>
cloze-deletion ||| <p>Ich komme <mark class="answer">spät</mark> zur Party.</p> ||| <p><strong>поздно</strong></p><blockquote>I come late to the party.</blockquote>
</example>

So, the user sees a german sentence, sees a translation in the languages he knows, and writes "spät" in the missing field.
There can be two (or more, any amount) answers per flashcard in cloze-deletion flashcards, but they must always be in the first column.
</instructions>

<format>
Flashcards can contain HTML. Here is an example of all supported html tags, taken from a real flashcard:

<blockquote>We have quotes</blockquote><p><br></p><p>H<sub>2</sub>O</p><p><br></p><p>2<sup>3</sup> = 8</p><p><br></p><pre class="ql-syntax" spellcheck="false">Here is some code
</pre><p><br></p><p>And here is <code>inline code</code>.</p><p><br></p><p>We also have unordered lists</p><ul><li>yellow</li><li>red</li></ul><p><br></p><p>And even numbered lists</p><ol><li>yellow</li><li>red</li></ol><p><br></p><p>And we have pictures.</p><p><img src="https://memcode-production.s3.us-west-2.amazonaws.com/1756437313511" style="" width="130"></p><p><br></p><p>We also have <a href="https://www.google.com/" rel="noopener noreferrer" target="_blank">links</a>.</p>
</format>

<example_output>
cloze-deletion  ||| Penicillin was discovered by Alexander <mark class="answer">Fleming</mark> in 1928. |||
question-answer ||| What was the first antibiotic? ||| Penicillin.
question-answer ||| What are antibiotics <i>only</i> effective against? ||| Bacteria.
</example_output>

Below, the user will tell you what kind of flashcards they want.\n\n\n`;

class SectionImportFlashcardsFromText extends React.Component {
  static propTypes = {
    courseId: PropTypes.number.isRequired,
    MyActions: PropTypes.object.isRequired,
    onProblemsImported: PropTypes.func,
    closeModal: PropTypes.func
  }

  state = {
    flashcardsToBeImported: [],
    speImport: {},
    parsingErrors: [],
    instructionsCopied: false
  }

  apiImportFlashcards = () =>
    api.post.ProblemApi.importFromExcel(
      (spe) => this.setState({ speImport: spe }),
      {
        courseId: this.props.courseId,
        problems: this.state.flashcardsToBeImported
      }
    )
      .then(async (response) => {
        // Update global state with newly created problems
        if (response && response.createdProblemIds) {
          response.createdProblemIds.forEach((problemId) => {
            this.props.MyActions.createProblem(this.props.courseId, problemId);
          });
        }
        
        // Refresh page state and wait for it to complete
        if (this.props.onProblemsImported) {
          await this.props.onProblemsImported();
        }
        
        // Close modal immediately after page refresh completes
        if (this.props.closeModal) {
          this.props.closeModal();
        }
        
        this.setState({ flashcardsToBeImported: [] });
      })

  copyLLMInstructionsToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(instructionsForLLM);
      this.setState({ instructionsCopied: true });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        this.setState({ instructionsCopied: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy instructions to clipboard:', err);
    }
  }

  uiSetAndValidateNewFlashcards = (event) => {
    const inputText = event.target.value.trim();
    const flashcardsToBeImported = [];
    const parsingErrors = [];
    
    if (!inputText) {
      this.setState({ flashcardsToBeImported: [], parsingErrors: [] });
      return;
    }

    // Split by lines and filter out empty lines
    const lines = inputText.split('\n').filter(line => line.trim());
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;
      const truncatedLine = line.length > 50 ? line.substring(0, 50) + '...' : line;
      
      // Split by ||| separator
      const parts = line.split('|||').map(part => part.trim());
      
      if (parts.length !== 3) {
        parsingErrors.push({
          lineNumber,
          truncatedLine,
          message: `Invalid format - expected 3 parts separated by '|||', found ${parts.length}`
        });
        continue;
      }
      
      const [cardType, question, answer] = parts;
      
      // Check for empty card type only
      if (!cardType) {
        parsingErrors.push({
          lineNumber,
          truncatedLine,
          message: 'Card type cannot be empty'
        });
        continue;
      }
      
      if (cardType === 'cloze-deletion') {
        flashcardsToBeImported.push({
          type: 'inlinedAnswers',
          content: {
            content: question,
            explanation: answer
          }
        });
      } else if (cardType === 'question-answer') {
        flashcardsToBeImported.push({
          type: 'separateAnswer',
          content: {
            content: question,
            answer: answer
          }
        });
      } else {
        parsingErrors.push({
          lineNumber,
          truncatedLine,
          message: `Unknown card type '${cardType}'. Expected 'cloze-deletion' or 'question-answer'`
        });
      }
    }
    
    this.setState({ flashcardsToBeImported, parsingErrors });
  }

  renderUploadExcelFileInput = () =>
    <div className="upload-excel-file-input-and-label">
      <textarea
        placeholder="Paste your flashcards here"
        onChange={this.uiSetAndValidateNewFlashcards}
      />
    </div>

  renderCreateFlashcardsButton = () => (
    this.state.flashcardsToBeImported.length > 0 ?
      <button
        className="create-flashcards-button button -pink"
        type="button"
        onClick={this.apiImportFlashcards}
      >
        Create {this.state.flashcardsToBeImported.length} flashcards
      </button> :
      <button
        className="create-flashcards-button button -pink -disabled"
        type="button"
      >Create flashcards</button>
  )

  renderParsingErrors = () => {
    if (this.state.parsingErrors.length === 0) return null;
    const n = this.state.parsingErrors.length;
    return (
      <div className="parsing-errors">
        <h3 style={{ color: '#d32f2f', fontSize: '16px', marginBottom: '10px', marginTop: '10px', fontWeight: 'bold' }}>
          ⚠️ Couldn't parse some lines ({n === 1 ? "1 line" : `${n} lines`})
        </h3>
        <ul style={{ listStyle: 'none' }}>
          {this.state.parsingErrors.map((error, index) => (
            <li key={index} style={{ 
              color: '#d32f2f', 
              marginBottom: '4px'
            }}>
              Line {error.lineNumber} (<span style={{ color: 'white' }}>"{error.truncatedLine}"</span>): {error.message}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  renderInstructions = () =>
    <article className="instructions">
      <div className="first-column">
        <p>
          <b>Create flashcards</b><br/>
          In bulk by pasting their html below. Useful for asking your LLM to create flashcards.<br/>
        </p>
        <p>
          <b>Format expected</b><br/>
          type of a flashcard ||| question ||| answer
        </p>
        <p>
          <b>A type of a flashcard</b><br/>
          To create a question-answer flashcard, write "question-answer ||| ... ||| ...".<br/>
          To create a fill-in-answer flashcard, write "cloze-deletion ||| ... ||| ...".
        </p>
        <p>
          <b>Instructions for LLM</b><br/>
          Click <button 
            type="button"
            onClick={this.copyLLMInstructionsToClipboard}
            style={{
              background: this.state.instructionsCopied ? '#4caf50' : '#007bff',
              color: 'white',
              border: 'none',
              padding: '0px 8px',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'all 0.2s ease'
            }}
          >
            {this.state.instructionsCopied ? '✓ Copied!' : 'here'}
          </button> to copy.
        </p>
      </div>

      <div className="second-column">
        <b>Example of valid text to insert</b>
        <textarea value={
`cloze-deletion  ||| Penicillin was discovered by Alexander <mark class="answer">Fleming</mark> in 1928. |||
question-answer ||| What was the first antibiotic? ||| Penicillin.
question-answer ||| What are antibiotics <i>only</i> effective against? ||| Bacteria.`}
readOnly
/>
      </div>
    </article>

  render = () =>
    <section className="import-flashcards -text">
      <h2 className="title">Create flashcards from text</h2>

      {this.renderInstructions()}

      {this.renderUploadExcelFileInput()}
      {this.renderParsingErrors()}
      {this.renderCreateFlashcardsButton()}

      <Loading spe={this.state.speImport}/> 

    </section>
}

export default SectionImportFlashcardsFromText;
