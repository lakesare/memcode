import React from 'react';
import { Link } from 'react-router';
import { AmountOfProblemsToReview } from './AmountOfProblemsToReview';

const ReviewAndLearn = ({ courseId, amountOfProblemsToLearn, amountOfProblemsToReview, nextDueDateIn }) =>
  <div className="review-and-learn">
    <div className="amount-of-mems-to-review-and-learn">
      <AmountOfProblemsToReview
        amountOfProblemsToReview={amountOfProblemsToReview}
        nextDueDateIn={nextDueDateIn}
      />
      <div className={amountOfProblemsToLearn === 0 ? `to-learn` : `to-learn -nonzero`}>
        {amountOfProblemsToLearn} to learn
      </div>
    </div>

    <div className="review-and-learn-links">
      <Link style={amountOfProblemsToReview === 0 ? { visibility: 'hidden' } : {}} className="review" to={`/courses/${courseId}/review`} >
        REVIEW
      </Link>
      <Link style={amountOfProblemsToLearn === 0 ? { visibility: 'hidden' } : {}} className="learn-more" to={`/courses/${courseId}/learn`} >
        LEARN
      </Link>
    </div>
  </div>;

ReviewAndLearn.propTypes = {
  courseId: React.PropTypes.number.isRequired,
  amountOfProblemsToLearn: React.PropTypes.number.isRequired,
  amountOfProblemsToReview: React.PropTypes.number.isRequired,
  nextDueDateIn: React.PropTypes.object
};

ReviewAndLearn.defaultPropTypes = {
  nextDueDateIn: null // can be null if we haven't learned any problems yet
};

export { ReviewAndLearn };
