import { Problem } from '~/components/Problem';
import { SeparateAnswerSelfScore } from './SeparateAnswerSelfScore';

class ProblemBeingSolved extends React.Component {
  static propTypes = {
    problem: PropTypes.object.isRequired,
    statusOfSolving: PropTypes.object.isRequired,
    amountOfProblems: PropTypes.number,

    enterPressed: PropTypes.func.isRequired,
    separateAnswerSelfScoreGiven: PropTypes.func.isRequired,
    randomizeProblems: PropTypes.func.isRequired,

    ifReviewIsSimulated: PropTypes.bool.isRequired,
    ifReviewingFailedProblems: PropTypes.bool.isRequired,
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
    <React.Fragment>
      {
        this.props.ifReviewIsSimulated &&
        <section className="instructions -simulated">
          <h4 className="where-we-are -desktop">
            We are in a simulated review. Results will not be recorded.
          </h4>
          <h4 className="where-we-are -mobile">
            Simulated review.
          </h4>
          <h4 className="amount-of-problems-left">
            {this.props.statusOfSolving.index + 1}/{this.props.amountOfProblems}
          </h4>
        </section>
      }

      {
        !this.props.ifReviewIsSimulated &&
        !this.props.ifReviewingFailedProblems &&
        <section className="instructions -real">
          <div className="container">
            <div className="where-we-are -desktop">
              Press ENTER fo reveal answers
            </div>

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
      }

      {
        this.props.ifReviewingFailedProblems &&
          <section className="instructions -simulated">
            <div className="where-we-are -desktop">
              We are repeating failed flashcards. Results will not be recorded.
            </div>
            <div className="where-we-are -mobile">
              Repeating failed flashcards.
            </div>
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
    </React.Fragment>
}

export { ProblemBeingSolved };
