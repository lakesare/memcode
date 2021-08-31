import Problem from '~/components/Problem';
import SeparateAnswerSelfScore from './components/SeparateAnswerSelfScore';
import Subheader from './components/Subheader';
import ProgressBar from '~/components/ProgressBar';

import css from './index.css';

class ProblemBeingSolved extends React.Component {
  static propTypes = {
    problem: PropTypes.object.isRequired,
    statusOfSolving: PropTypes.object.isRequired,
    amountOfProblems: PropTypes.number,
    amountOfFailedProblems: PropTypes.number.isRequired,
    amountOfFailedProblemsLeft: PropTypes.number.isRequired,

    enterPressed: PropTypes.func.isRequired,
    separateAnswerSelfScoreGiven: PropTypes.func.isRequired,
    randomizeProblems: PropTypes.func.isRequired,
    switchQuestionAndAnswer: PropTypes.func.isRequired,

    ifReviewIsSimulated: PropTypes.bool.isRequired,
    ifReviewIsPersistent: PropTypes.bool.isRequired,
    ifReviewingFailedProblems: PropTypes.bool.isRequired,
    onRightAnswerGiven: PropTypes.func.isRequired,
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.onEnter, false);

    this.blurRandomizeButtons();
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.problem.id !== this.props.problem.id) {
      this.blurRandomizeButtons();
    }
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.onEnter);
  }

  // so that when we press ENTER we are not redirected to some random course/problem again
  blurRandomizeButtons = () => {
    // but don't blur if we already focused on the answer input in the 'inlinedAnswers' problem!
    const ifFocusedOnAnswerInput = document.activeElement.classList.contains('answer-input');
    if (!ifFocusedOnAnswerInput) {
      document.activeElement.blur();
    }
  }

  onEnter = (event) => {
    if (event.key !== 'Enter') return;

    // are we in the answer draft (where we may want to press enter)?
    const weAreInDraftAnswer = (
      this.props.problem.type === 'separateAnswer' &&
      document.activeElement.className === 'ql-editor'
    );

    if (!weAreInDraftAnswer) {
      this.props.enterPressed();
    }
  }

  renderProgressBar = () => {
    let current;
    let max;

    if (this.props.ifReviewingFailedProblems) {
      current = 1 + this.props.amountOfFailedProblems - this.props.amountOfFailedProblemsLeft;
      max = this.props.amountOfFailedProblems;
    } else {
      current = 1 + this.props.statusOfSolving.index;
      max = this.props.amountOfProblems;
    }

    return (
      <div className={`n-of-problems-left ${this.props.ifReviewingFailedProblems ? '-failed' : ''}`}>
        <div className="container">
          <ProgressBar currentAmount={current} maxAmount={max}/>
        </div>
      </div>
    );
  }

  render = () =>
    <section className={`ProblemBeingSolved ${css.section}`}>
      <Subheader
        statusOfSolving={this.props.statusOfSolving}
        amountOfProblems={this.props.amountOfProblems}
        amountOfFailedProblems={this.props.amountOfFailedProblems}
        amountOfFailedProblemsLeft={this.props.amountOfFailedProblemsLeft}

        randomizeProblems={this.props.randomizeProblems}
        switchQuestionAndAnswer={this.props.switchQuestionAndAnswer}

        ifReviewIsSimulated={this.props.ifReviewIsSimulated}
        ifReviewIsPersistent={this.props.ifReviewIsPersistent}
        ifReviewingFailedProblems={this.props.ifReviewingFailedProblems}
      />

      <div className="container review-container">
        <Problem
          mode="review"
          problemId={this.props.problem.id}
          problemContent={this.props.problem.content}
          problemType={this.props.problem.type}
          statusOfSolving={this.props.statusOfSolving}
          enterPressed={this.props.enterPressed}
          onRightAnswerGiven={this.props.onRightAnswerGiven}
        />

        {
          // !this.props.ifReviewIsSimulated &&
          this.props.statusOfSolving.status === 'seeingAnswer' &&
          this.props.problem.type === 'separateAnswer' &&
          <SeparateAnswerSelfScore
            giveScore={this.props.separateAnswerSelfScoreGiven}
            score={this.props.statusOfSolving.typeSpecific.selfScore}
          />
        }

        {
          this.props.statusOfSolving.status === 'solving' &&
          this.props.problem.type === 'inlinedAnswers' &&
          <button type="button" className="button reveal" onClick={this.props.enterPressed}>
            SEE ANSWER
          </button>
        }

        {
          this.props.statusOfSolving.status === 'seeingAnswer' &&
          <button type="button" className="button next-button -purple" onClick={this.props.enterPressed}>
            NEXT
          </button>
        }
      </div>

      {this.renderProgressBar()}
    </section>
}

export default ProblemBeingSolved;
