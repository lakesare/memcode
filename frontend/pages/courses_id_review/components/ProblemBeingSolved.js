import { ProblemWithSeparateAnswer_review } from '~/components/ProblemWithSeparateAnswer/Review';
import { SeparateAnswerSelfScore } from './SeparateAnswerSelfScore';

class ProblemBeingSolved extends React.Component {
  static propTypes = {
    problem: PropTypes.object.isRequired,
    statusOfSolving: PropTypes.object.isRequired,
    amountOfProblems: PropTypes.number,

    enterPressed: PropTypes.func.isRequired,
    separateAnswerSelfScoreGiven: PropTypes.func.isRequired,

    ifReviewIsSimulated: PropTypes.bool.isRequired
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
      document.activeElement.className === 'public-DraftEditor-content'
    );

    if (!weAreInDraftAnswer) {
      this.props.enterPressed();
    }
  }

  render = () =>
    <div>
      {
        this.props.ifReviewIsSimulated &&
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
        </section>
      }

      <ProblemWithSeparateAnswer_review
        problemContent={this.props.problem.content}
        mode={this.props.statusOfSolving.status}
        enterPressed={this.props.enterPressed}
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
        this.props.statusOfSolving.status === 'seeingAnswer' &&
        <a className="button next" onClick={this.props.enterPressed}>
          NEXT
        </a>
      }
    </div>
}

export { ProblemBeingSolved };
