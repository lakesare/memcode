const AmountOfProblemsToReview = ({ amountOfProblemsToReview, nextDueDateIn }) => {
  // user will have to review some problems soon
  if (amountOfProblemsToReview === 0 && nextDueDateIn) {
    const biggestMeasure = Object.keys(nextDueDateIn)[0];
    const amount = nextDueDateIn[biggestMeasure];

    return <div className="to-review -zero">
      {`in ${amount} ${biggestMeasure}`}
    </div>;
  // user hasn't learned anything from this course yet
  } else if (amountOfProblemsToReview === 0 && !nextDueDateIn) {
    return <div className="to-review"/>;
  // user has problems to review
  } else if (amountOfProblemsToReview > 0) {
    return <div className="to-review -nonzero">
      {amountOfProblemsToReview} to review
    </div>;
  }
};

AmountOfProblemsToReview.propTypes = {
  amountOfProblemsToReview: PropTypes.number.isRequired,
  nextDueDateIn: PropTypes.object // postgresql interval (eg { days: 3, hours: 5 })
};

AmountOfProblemsToReview.defaultPropTypes = {
  nextDueDateIn: null
};

export { AmountOfProblemsToReview };
