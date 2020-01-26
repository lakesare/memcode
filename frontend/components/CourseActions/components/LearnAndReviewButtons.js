import { orFalse } from '~/services/orFalse';
// import humanizePostgresInterval from '~/services/humanizePostgresInterval';
// import ifPositivePostgresInterval from '~/services/ifPositivePostgresInterval';

import { Link } from 'react-router-dom';
import StandardTooltip from '~/components/StandardTooltip';

class LearnAndReviewButtons extends React.Component {
  static propTypes = {
    courseUserIsLearning: PropTypes.object,
    amountOfProblems: orFalse(PropTypes.object).isRequired,
    nextDueDateIn: orFalse(PropTypes.object),
    apiStopLearning: PropTypes.func.isRequired
  }

  static defaultProps = {
    courseUserIsLearning: null,
    nextDueDateIn: false
  }

  ifCourseIsLearnedAndActive = () => {
    const cuil = this.props.courseUserIsLearning;
    return cuil && cuil.active;
  }

  // there are no flashcards to review now!
  // if there are learned nonignored flashcards in this course:
  //   Wait until the next review! It will be in 3 days.
  // else:
  //   if there are already some flashcards, just unlearned or ignored:
  //     LEARN some of the flashcards before reviewing them!
  //   else:
  //     // then it's most likely an Author
  //     There are no flashcards to review yet! CREATE, and then LEARN a few flashcards in order to get started.
  // getSimulatedReviewTooltip = () => {
  //   if (this.props.nextDueDateIn) {
  //     return `Wait until the next review! It will be in ${humanizePostgresInterval(this.props.nextDueDateIn)}.`;
  //   // nextDueDateIn is null here (I think?)
  //   } else if (this.props.amountOfProblems.toLearn > 0) {
  //     return "You have nothing to review yet. Learn some flashcards first!";
  //   } else {
  //     return "There are no flashcards to review yet. Is this your course or not? Create some!";
  //   }
  // }

  getTooltipProps = () => ({
    tooltipProps: {
      delay: 1000,
      animation: 'fade',
      duration: 600
    }
  })

  renderLearnButton = () =>
    <Link
      to={`/courses/${this.props.courseUserIsLearning.courseId}/learn`}
      className="button -to-learn"
    >LEARN ({this.props.amountOfProblems.toLearn})</Link>

  // You have ${this.props.amountOfProblems.toReview} flashcards to repeat! Click here, and try to recall the answers to your flashcards.
  renderReviewButton = () =>
    <Link
      to={`/courses/${this.props.courseUserIsLearning.courseId}/review`}
      className="button -to-review"
    >REVIEW ({this.props.amountOfProblems.toReview})</Link>

  renderDropdown = () =>
    <ul className="standard-tooltip-dropdown">
      {
        this.props.stats.amountOfProblems > 0 &&
        <li>
          <Link
            to={`/courses/${this.props.courseUserIsLearning.courseId}/review/simulated`}
            style={{ color: 'rgb(236, 236, 133)' }}
          >
            Test Drive
          </Link>
          <div className="comment -white">
            Review all flashcards of this course without your results being recorded.
          </div>
        </li>
      }

      <li>
        <button
          type="button"
          onClick={this.props.apiStopLearning}
          style={{ color: 'rgb(252, 126, 126)' }}
        >
          Stop Learning
        </button>
        <div className="comment -white">
          You won't be asked to review flashcards from this course again.
        </div>
      </li>
    </ul>

  render = () =>
    this.ifCourseIsLearnedAndActive() &&
    this.props.amountOfProblems && // and therefore ToReview is ready too
    <div className="learn-and-review-buttons">
      {
        this.props.amountOfProblems.toLearn > 0 &&
        this.renderLearnButton()
      }

      {
        this.props.amountOfProblems.toReview > 0 &&
        this.renderReviewButton()
      }

      <StandardTooltip
        tooltipEl={this.renderDropdown()}
        tooltipProps={{
          interactive: true,
          placement: 'bottom-end',
          trigger: 'click'
        }}
      >
        <button type="button" className="more-button">
          <i className="material-icons">more_vert</i>
        </button>
      </StandardTooltip>
    </div>
}

export { LearnAndReviewButtons };
