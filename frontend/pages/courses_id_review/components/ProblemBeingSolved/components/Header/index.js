import css from './index.css';

class Header extends React.Component {
  static propTypes = {
    statusOfSolving: PropTypes.object.isRequired,
    amountOfProblems: PropTypes.number,

    randomizeProblems: PropTypes.func.isRequired,
    switchQuestionAndAnswer: PropTypes.func.isRequired,

    ifReviewIsSimulated: PropTypes.bool.isRequired,
    ifReviewingFailedProblems: PropTypes.bool.isRequired
  }

  renderSimulatedReview = () =>
    <section className={`${css.section} -simulated-review`}>
      <div className="container">
        <div className="instructions -desktop">
          <p>Test drive! Results will not be recorded.</p>
          <p>Press ENTER to reveal answers</p>
        </div>
        <div className="instructions -mobile">
          <p>Test drive! <br/>Results are not recorded.</p>
        </div>
        <div className="amount-of-problems-left">
          {this.props.statusOfSolving.index + 1}/{this.props.amountOfProblems} flashcards
        </div>
      </div>
    </section>

  renderUsualReview = () =>
    <section className={`Header ${css.section} -usual-review`}>
      <div className="container">
        <div className="instructions -desktop">
          Press ENTER fo reveal answers
        </div>

        {/* for flexbox to float randomize buttons to the right */}
        <div className="instructions -mobile"/>

        <div className="buttons">
          <button type="button" className="button -purple-o switch-answer-and-definition-button" onClick={this.props.switchQuestionAndAnswer}>
            Term ⟷ definition
          </button>

          {
            // if it's not the last problem we're reviewing - randomize
            this.props.amountOfProblems !== this.props.statusOfSolving.index + 1 &&
            <button type="button" className="button -purple-o randomize-button" onClick={this.props.randomizeProblems}>
              Randomize
            </button>
          }
        </div>
      </div>
    </section>

  renderFailedFlashcardsReview = () =>
    <section className={`${css.section} -failed-flashcards-review`}>
      <div className="container">
        <div className="instructions -desktop">
          We are repeating failed flashcards. Results will not be recorded.
        </div>
        <div className="instructions -mobile">
          Repeating failed flashcards.
        </div>
      </div>
    </section>

  render = () => {
    if (!this.props.ifReviewIsSimulated && !this.props.ifReviewingFailedProblems) {
      return this.renderUsualReview();
    } else if (this.props.ifReviewIsSimulated) {
      return this.renderSimulatedReview();
    } else if (this.props.ifReviewingFailedProblems) {
      return this.renderFailedFlashcardsReview();
    }
  }
}

export default Header;
