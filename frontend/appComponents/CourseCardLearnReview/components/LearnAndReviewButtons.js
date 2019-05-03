import humanizePostgresInterval from '~/services/humanizePostgresInterval';

import { Link } from 'react-router-dom';

class LearnAndReviewButtons extends React.Component {
  static propTypes = {
    courseId: PropTypes.number.isRequired,
    amountOfProblemsToLearn: PropTypes.number.isRequired,
    amountOfProblemsToReview: PropTypes.number.isRequired,
    nextDueDateIn: PropTypes.object
  }

  static defaultProps = {
    nextDueDateIn: null // can be null if we haven't learned any problems yet
  }

  renderAmountOfProblemsToReview = (amountOfProblemsToReview, nextDueDateIn) => {
    // user will have to review some problems soon
    if (amountOfProblemsToReview === 0 && nextDueDateIn) {
      return <div className="review -zero">
        in {humanizePostgresInterval(nextDueDateIn)}
      </div>;
    // user hasn't learned anything from this course yet
    } else if (amountOfProblemsToReview === 0 && !nextDueDateIn) {
      return <div className="review -empty"/>;
    // user has problems to review
    } else if (amountOfProblemsToReview > 0) {
      return <div className="review -nonzero">
        {amountOfProblemsToReview} to review
      </div>;
    }
  }

  renderAmountFooter = (amountOfProblemsToLearn, amountOfProblemsToReview, nextDueDateIn) =>
    <section className="amount-footer">
      <div className={`learn ${amountOfProblemsToLearn === 0 ? '-zero' : '-nonzero'}`}>
        {amountOfProblemsToLearn} to learn
      </div>
      {this.renderAmountOfProblemsToReview(amountOfProblemsToReview, nextDueDateIn)}
    </section>

  renderLinks = (amountOfProblemsToLearn, amountOfProblemsToReview, courseId) =>
    <section className="links">
      <Link
        className={`learn ${amountOfProblemsToLearn === 0 ? '-zero' : '-nonzero'}`}
        to={`/courses/${courseId}/learn`}
      >LEARN</Link>

      {
        amountOfProblemsToReview > 0 ?
          <Link className="review" to={`/courses/${courseId}/review`}>
            REVIEW
          </Link> :
          <Link className="review -simulated" to={`/courses/${courseId}/review/simulated`}>
            REVIEW without recording results
          </Link>
      }
    </section>

  render = () =>
    <div className="learn-and-review-buttons">
      {this.renderLinks(this.props.amountOfProblemsToLearn, this.props.amountOfProblemsToReview, this.props.courseId)}
      {this.renderAmountFooter(this.props.amountOfProblemsToLearn, this.props.amountOfProblemsToReview, this.props.nextDueDateIn)}
    </div>
}

export default LearnAndReviewButtons;
