import Problem from '~/components/Problem';
import SeparateAnswerSelfScore from './components/SeparateAnswerSelfScore';
import Subheader from './components/Subheader';
import ProgressBar from '~/components/ProgressBar';

import css from './index.scss';

class ProblemBeingSolved extends React.Component {
  static propTypes = {
    problem: PropTypes.object.isRequired,
    statusOfSolving: PropTypes.object.isRequired,
    amountOfProblems: PropTypes.number,
    amountOfFailedProblems: PropTypes.number.isRequired,
    amountOfFailedProblemsLeft: PropTypes.number.isRequired,
    clozeDeletionMode: PropTypes.string.isRequired,

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
    if (event.key === 'Enter') {
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

  renderAction = (statusOfSolving, problemType) => {
    if (statusOfSolving === 'solving' && problemType === 'inlinedAnswers') {
      return(
        <button type="button" className="button reveal" onClick={this.props.enterPressed}>
          SEE ANSWER
        </button>
      );
    } else if (statusOfSolving === 'solving' && problemType === 'separateAnswer') {
      return null;
    } else if (statusOfSolving === 'seeingAnswer' && problemType === 'inlinedAnswers') {
      if (this.props.clozeDeletionMode === "typing") {
        return(
          <button type="button" className="button next-button -purple" onClick={this.props.enterPressed}>
            NEXT
          </button>
        );
      } else {
        return(
          <>
            <button type="button" className="button next-button -purple" onClick={this.props.enterPressed}>
              NEXT
            </button>

            <SeparateAnswerSelfScore
              giveScore={this.props.separateAnswerSelfScoreGiven}
              score={this.props.statusOfSolving.typeSpecific.selfScore}
            />
          </>
        )
      }
    } else if (statusOfSolving === 'seeingAnswer' && problemType === 'separateAnswer') {
      return(
        <>
          <SeparateAnswerSelfScore
            giveScore={this.props.separateAnswerSelfScoreGiven}
            score={this.props.statusOfSolving.typeSpecific.selfScore}
          />
    
          <button type="button" className="button next-button -purple" onClick={this.props.enterPressed}>
            NEXT
          </button>
        </>
      );
    }
  }

  render = () =>
    <section className={`ProblemBeingSolved ${css.section} -${this.props.clozeDeletionMode}`}>
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

      {this.renderProgressBar()}

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

        {this.renderAction(this.props.statusOfSolving.status, this.props.problem.type)}
      </div>
    </section>
}

export default ProblemBeingSolved;
