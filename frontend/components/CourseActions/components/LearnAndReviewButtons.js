import { orFalse } from '~/services/orFalse';
import humanizePostgresInterval from '~/services/humanizePostgresInterval';
// import ifPositivePostgresInterval from '~/services/ifPositivePostgresInterval';

import { Link } from 'react-router-dom'
import StandardTooltip from '~/components/StandardTooltip';

class LearnAndReviewButtons extends React.Component {
  static propTypes = {
    courseUserIsLearning: PropTypes.object,
    amountOfProblems: orFalse(PropTypes.object).isRequired,
    nextDueDateIn: orFalse(PropTypes.object),
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
  getSimulatedReviewTooltip = () => {
    if (this.props.nextDueDateIn) {
      return `Wait until the next review! It will be in ${humanizePostgresInterval(this.props.nextDueDateIn)}.`;
    } else {
      // nextDueDateIn is null here (I think?)
      if (this.props.amountOfProblems.toLearn > 0) {
        return "You have nothing to review yet. Learn some flashcards first!";
      } else {
        return "There are no flashcards to review yet. Is this your course or not? Create some!";
      }
    }
  }

  getLearnButtonTooltip = () => {
    if (this.props.amountOfProblems.toLearn > 0) {
      return "Click LEARN to mark flashcards you are ready to review.";
    } else {
      return "Create some flashcards before learning them.";
    }
  }

  getTooltipProps = () => ({
    tooltipProps: {
      delay: 1000,
      animation: 'fade',
      duration: 600
    }
  })

  renderLearnButton = () =>
    <StandardTooltip {...this.getTooltipProps()} tooltipEl={this.getLearnButtonTooltip()}>
      <Link
        to={`/courses/${this.props.courseUserIsLearning.courseId}/learn`}
        className={`learn ${this.props.amountOfProblems.toLearn === 0 ? '-disabled' : ''}`}
      >LEARN ({this.props.amountOfProblems.toLearn})</Link>
    </StandardTooltip>

  renderReviewButton = () =>
    <StandardTooltip {...this.getTooltipProps()} tooltipEl={`You have ${this.props.amountOfProblems.toReview} flashcards to repeat! Click here, and try to recall the answers to your flashcards.`}>
      <Link
        to={`/courses/${this.props.courseUserIsLearning.courseId}/review`}
        className="review"
      >REVIEW ({this.props.amountOfProblems.toReview})</Link>
    </StandardTooltip>

  renderSimulatedReviewButton = () =>
    <StandardTooltip {...this.getTooltipProps()} tooltipEl={this.getSimulatedReviewTooltip()}>
      <Link
        to={`/courses/${this.props.courseUserIsLearning.courseId}/review/simulated`}
        className="review -disabled"
      >REVIEW (0)</Link>
    </StandardTooltip>

  render = () =>
    this.ifCourseIsLearnedAndActive() &&
    this.props.amountOfProblems && // and therefore ToReview is ready too
    <div className="learn-and-review-buttons">
      {this.renderLearnButton()}

      {
        this.props.amountOfProblems.toReview > 0 ?
          this.renderReviewButton() :
          this.renderSimulatedReviewButton()
      }
    </div>
}

export { LearnAndReviewButtons };
