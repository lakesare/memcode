import Problem from '~/components/Problem';
import SeparateAnswerSelfScore from './components/SeparateAnswerSelfScore';
import Header from './components/Header';

import css from './index.css';

class ProblemBeingSolved extends React.Component {
  static propTypes = {
    problem: PropTypes.object.isRequired,
    statusOfSolving: PropTypes.object.isRequired,
    amountOfProblems: PropTypes.number,

    enterPressed: PropTypes.func.isRequired,
    separateAnswerSelfScoreGiven: PropTypes.func.isRequired,
    randomizeProblems: PropTypes.func.isRequired,
    switchQuestionAndAnswer: PropTypes.func.isRequired,

    ifReviewIsSimulated: PropTypes.bool.isRequired,
    ifReviewingFailedProblems: PropTypes.bool.isRequired,
    onRightAnswerGiven: PropTypes.func.isRequired,
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.onEnter, false);
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.onEnter);
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

  render = () =>
    <section className={`ProblemBeingSolved ${css.section}`}>
      <Header
        statusOfSolving={this.props.statusOfSolving}
        amountOfProblems={this.props.amountOfProblems}

        randomizeProblems={this.props.randomizeProblems}
        switchQuestionAndAnswer={this.props.switchQuestionAndAnswer}

        ifReviewIsSimulated={this.props.ifReviewIsSimulated}
        ifReviewingFailedProblems={this.props.ifReviewingFailedProblems}
      />

      <Problem
        mode="review"
        problemContent={this.props.problem.content}
        problemType={this.props.problem.type}
        statusOfSolving={this.props.statusOfSolving}
        enterPressed={this.props.enterPressed}
        onRightAnswerGiven={this.props.onRightAnswerGiven}
      />

      {
        !this.props.ifReviewIsSimulated &&
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
    </section>
}

export default ProblemBeingSolved;
