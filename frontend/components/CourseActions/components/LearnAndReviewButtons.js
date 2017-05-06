import { Link } from 'react-router';

class LearnAndReviewButtons extends React.Component {
  static propTypes = {
    courseUserIsLearning: PropTypes.object,
    amountOfProblemsToLearn: PropTypes.number,
    amountOfProblemsToReview: PropTypes.number
  }

  static defaultProps = {
    courseUserIsLearning: null,
    amountOfProblemsToLearn: null,
    amountOfProblemsToReview: null
  }

  ifCourseIsLearnedAndActive = () => {
    const cuil = this.props.courseUserIsLearning;
    return cuil && cuil.active;
  }

  render = () =>
    this.ifCourseIsLearnedAndActive() &&
    <div className="learn-and-review-buttons">
      <Link
        to={`/courses/${this.props.courseUserIsLearning.courseId}/learn`}
        className={`learn ${this.props.amountOfProblemsToLearn === 0 ? '-disabled' : ''}`}
      >
        LEARN ({this.props.amountOfProblemsToLearn})
      </Link>

      <Link
        to={`/courses/${this.props.courseUserIsLearning.courseId}/review`}
        className={`review ${this.props.amountOfProblemsToReview === 0 ? '-disabled' : ''}`}
      >
        REVIEW ({this.props.amountOfProblemsToReview})
      </Link>
    </div>
}

export { LearnAndReviewButtons };
