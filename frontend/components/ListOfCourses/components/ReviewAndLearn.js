import React from 'react';
import { Link } from 'react-router';

const renderAmountToReview = (amountOfProblemsToReview, nextDueDateIn) => {
  if (amountOfProblemsToReview > 0) {
    return <div className="to-review -nonzero">
      {amountOfProblemsToReview} to review
    </div>;
  } else {
    // { days: 3, hours: 5 }
    const biggestMeasure = Object.keys(nextDueDateIn)[0];
    const amount = nextDueDateIn[biggestMeasure];

    if (amount < 0) {
      return <div className="to-review"/>
    } else {
      return <div className="to-review -zero">
        {`in ${amount} ${biggestMeasure}`}
      </div>;
    }
  }
};

const ReviewAndLearn = ({ courseId, amountOfProblemsToLearn, amountOfProblemsToReview, nextDueDateIn }) =>
  <div className="review-and-learn">
    <div className="amount-of-mems-to-review-and-learn">
      {renderAmountToReview(amountOfProblemsToReview, nextDueDateIn)}
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
  nextDueDateIn: React.PropTypes.object.isRequired
};

export { ReviewAndLearn };
