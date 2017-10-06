import { orFalse } from '~/services/orFalse';
import { Link } from 'react-router';

class LearnAndReviewButtons extends React.Component {
  static propTypes = {
    courseUserIsLearning: PropTypes.object,
    amountOfProblems: orFalse(PropTypes.object).isRequired,
  }

  static defaultProps = {
    courseUserIsLearning: null
  }

  ifCourseIsLearnedAndActive = () => {
    const cuil = this.props.courseUserIsLearning;
    return cuil && cuil.active;
  }

  render = () =>
    this.ifCourseIsLearnedAndActive() &&
    this.props.amountOfProblems && // and therefore ToReview is ready too
    <div className="learn-and-review-buttons">
      <Link
        to={`/courses/${this.props.courseUserIsLearning.courseId}/learn`}
        className={`learn ${this.props.amountOfProblems.toLearn === 0 ? '-disabled' : ''}`}
      >LEARN ({this.props.amountOfProblems.toLearn})</Link>

      {
        this.props.amountOfProblems.toReview > 0 ?
          <Link
            to={`/courses/${this.props.courseUserIsLearning.courseId}/review`}
            className="review"
          >REVIEW ({this.props.amountOfProblems.toReview})</Link> :
          <Link
            to={`/courses/${this.props.courseUserIsLearning.courseId}/review/simulated`}
            className="review -disabled"
          >REVIEW (0)</Link>
      }
    </div>
}

export { LearnAndReviewButtons };
