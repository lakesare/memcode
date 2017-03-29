import React from 'react';
import { Link } from 'react-router';

import css from './index.css';

class LearnAndReviewButtons extends React.Component {
  static propTypes = {
    courseUserIsLearning: React.PropTypes.object,
    amountOfProblemsToLearn: React.PropTypes.number,
    amountOfProblemsToReview: React.PropTypes.number
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
    <div className={css['learn-and-review-buttons']}>
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
