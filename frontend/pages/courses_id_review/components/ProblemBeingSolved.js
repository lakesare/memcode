import { Problem } from '~/components/Problem';
import { SeparateAnswerSelfScore } from './SeparateAnswerSelfScore';

class ProblemBeingSolved extends React.Component {
  static propTypes = {
    problem: PropTypes.object.isRequired,
    statusOfSolving: PropTypes.object.isRequired,
    amountOfProblems: PropTypes.number,

    enterPressed: PropTypes.func.isRequired,
    separateAnswerSelfScoreGiven: PropTypes.func.isRequired,

    ifReviewIsSimulated: PropTypes.bool.isRequired,
    onRightAnswerGiven: PropTypes.func.isRequired
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
    <div>
      {
        this.props.ifReviewIsSimulated ?
          <section className="simulated-header">
            <h4 className="announcement desktop">
              We are in a simulated review. Results will not be recorded.
            </h4>
            <h4 className="announcement mobile hidden">
              Simulated review.
            </h4>
            <h4 className="amount-of-problems-left">
              {this.props.statusOfSolving.index + 1}/{this.props.amountOfProblems}
            </h4>
          </section> :
          <section className="simulated-header">
            <h4 className="announcement desktop">
              Press ENTER fo reveal answers
            </h4>
          </section>
      }

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
        <button type="button" className="button next" onClick={this.props.enterPressed}>
          NEXT
        </button>
      }
    </div>
}

export { ProblemBeingSolved };
