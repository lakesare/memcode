import flashcardCss from '~/pages/courses_id_review/components/ProblemBeingSolved/index.css';

const initialState = {
  separate_mode: 'solving',

  inline_isAnswered: false,
  inline_currentGuess: ''
};

class FakeFlashcards extends React.Component {
  state = initialState

  onChange = (event, secretWord) => {
    const newGuess = event.target.value;
    this.setState({ inline_currentGuess: newGuess });

    if (newGuess === secretWord) {
      this.setState({ inline_isAnswered: true });
    }
  }

  resetState = () =>
    this.setState(initialState)

  renderAnswer = (secretWord) =>
    <input
      className="answer-input"
      data-answered={this.state.inline_isAnswered ? 'right' : 'waiting'}
      type="text"
      readOnly={this.state.inline_isAnswered}
      onChange={(event) => this.onChange(event, secretWord)}
      value={this.state.inline_currentGuess}
    />

  renderInline = () =>
    <section className="problem -withInlinedAnswers">
      <div className="quill -readOnly question first-column">
        <div className="ql-container ql-snow">
          <div className="ql-editor">
            Operation is {this.renderAnswer('idempotent')} if it can be applied multiple times without changing the result after the initial application.
          </div>
        </div>
      </div>

      <div className="quill -readOnly answer second-column">
        <div className="ql-container ql-snow">
          <div className="ql-editor">
            (Try typing in <strong>'idempotent'</strong>)
          </div>
        </div>
      </div>
    </section>

  renderSeparate = () =>
    <section className="problem -withSeparateAnswer">
      <div className="question-and-answer">
        <div className="quill -readOnly question first-column">
          <div className="ql-container ql-snow">
            <div className="ql-editor">
              How would you interpolate a string in ES6?
            </div>
          </div>
        </div>
        {
          this.state.separate_mode === 'solving' ?
            <button
              type="button"
              className="see-answer-button second-column"
              onClick={() => this.setState({ separate_mode: 'seeingAnswer' })}
            >
              See answer
            </button> :
            <div className="quill -readOnly answer second-column">
              <div className="ql-container ql-snow">
                <div className="ql-editor">
                  <pre>
                    <code>`Hello, ${"{name}"}`</code>
                  </pre>
                </div>
              </div>
            </div>
        }
      </div>
    </section>

  render = () =>
    <div>
      <ol className={`two-types-of-flashcard ${flashcardCss.section}`}>
        <li className="separate">
          <div className="instruction -top">
            Question + Answer flashcard
          </div>
          {this.renderSeparate()}
          <div className="instruction -bottom">
            Think of your answer, and then rate yourself!
          </div>
        </li>
        <li className="inline">
          <div className="instruction -top">
            Cloze Deletion flashcard
          </div>
          {this.renderInline()}
          <div className="instruction -bottom">
            Type in the answer, and we'll automatically tell you just how right you are!
          </div>
        </li>
      </ol>

      <button
        type="button"
        className="button -orange -move-up-on-hover reset-button"
        onClick={this.resetState}
      >Play Again</button>
    </div>
}

export default FakeFlashcards;
