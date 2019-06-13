import css from './index.css';

import ProgressBar from '~/components/ProgressBar';

class Subheader extends React.Component {
  static propTypes = {
    statusOfSolving: PropTypes.object.isRequired,
    amountOfProblems: PropTypes.number.isRequired,
    amountOfFailedProblems: PropTypes.number.isRequired,
    amountOfFailedProblemsLeft: PropTypes.number.isRequired,

    randomizeProblems: PropTypes.func.isRequired,
    switchQuestionAndAnswer: PropTypes.func.isRequired,

    ifReviewIsSimulated: PropTypes.bool.isRequired,
    ifReviewingFailedProblems: PropTypes.bool.isRequired
  }

  state = {
    volume: localStorage.getItem('volume') || 'no'
  }

  updateVolume = () => {
    if (this.state.volume === 'yes') {
      localStorage.setItem('volume', 'no');
      this.setState({ volume: 'no' });
    } else {
      localStorage.setItem('volume', 'yes');
      this.setState({ volume: 'yes' });
    }
  }

  renderProgressBar = (current, max) =>
    <div className="amount-of-problems-left">
      <label>{current}/{max}</label>

      <ProgressBar
        currentAmount={current}
        maxAmount={max}
      />
    </div>

  renderSimulatedReview = () =>
    <section className={`Subheader ${css.section} -simulated-review`}>
      <div className="container">
        <div className="instructions -desktop">
          <p><em className="yellow-emphasis">Test drive</em> - results will not be recorded. Press ENTER to reveal answers</p>
        </div>
        <div className="instructions -mobile">
          <p><em className="yellow-emphasis">Test drive</em> - results are not recorded.</p>
        </div>
        {this.renderProgressBar(this.props.statusOfSolving.index, this.props.amountOfProblems)}
      </div>
    </section>

  renderVolumeButton = () =>
    <button
      type="button"
      className={`volume-button ${this.state.volume === 'yes' ? '-yes' : '-no'}`}
      onClick={this.updateVolume}
    >
      <i className="material-icons -yes">volume_up</i>
      <i className="material-icons -no">volume_off</i>
    </button>;

  renderUsualReview = () =>
    <section className={`Subheader ${css.section} -usual-review`}>
      <div className="container">
        <div className="instructions -desktop">
          <em className="review-emphasis">REVIEW</em> - we are repeating due flashcards <em className="white-emphasis">🍬</em>.
          Press ENTER fo reveal answers.
        </div>

        {/* for flexbox to float randomize buttons to the right */}
        <div className="instructions -mobile"/>

        <div className="buttons">
          {this.renderVolumeButton()}

          {
            false &&
            <button type="button" className="button -purple-o switch-answer-and-definition-button" onClick={this.props.switchQuestionAndAnswer}>
              Term ⟷ definition
            </button>
          }

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
    <section className={`Subheader ${css.section} -failed-flashcards-review`}>
      <div className="container">
        <div className="instructions -desktop">
          <em className="red-emphasis">BY HEART</em> - we are repeating failed flashcards <em className="red-emphasis -darker">♥</em>. Results will not be recorded.
        </div>
        <div className="instructions -mobile">
          <em className="red-emphasis">BY HEART</em> - repeating failed flashcards <em className="red-emphasis -darker">♥</em>
        </div>

        {this.renderProgressBar(this.props.amountOfFailedProblems - this.props.amountOfFailedProblemsLeft, this.props.amountOfFailedProblems)}
      </div>
    </section>

  render = () => {
    console.log(this.props);
    if (!this.props.ifReviewIsSimulated && !this.props.ifReviewingFailedProblems) {
      return this.renderUsualReview();
    } else if (this.props.ifReviewIsSimulated && !this.props.ifReviewingFailedProblems) {
      return this.renderSimulatedReview();
    } else if (this.props.ifReviewingFailedProblems) {
      return this.renderFailedFlashcardsReview();
    }
  }
}

export default Subheader;
