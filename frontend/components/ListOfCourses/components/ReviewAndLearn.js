import { Link } from 'react-router';
import { AmountOfProblemsToReview } from './AmountOfProblemsToReview';

class ReviewAndLearn extends React.Component {
  static propTypes = {
    courseId: PropTypes.number.isRequired,
    amountOfProblemsToLearn: PropTypes.number.isRequired,
    amountOfProblemsToReview: PropTypes.number.isRequired,
    nextDueDateIn: PropTypes.object
  }

  static defaultProps = {
    nextDueDateIn: null // can be null if we haven't learned any problems yet
  }

  renderAmountFooter = (amountOfProblemsToLearn, amountOfProblemsToReview, nextDueDateIn) =>
    <section className="amount-footer">
      <div className={`learn ${amountOfProblemsToLearn === 0 ? '-zero' : '-nonzero'}`}>
        {amountOfProblemsToLearn} to learn
      </div>
      <AmountOfProblemsToReview
        amountOfProblemsToReview={amountOfProblemsToReview}
        nextDueDateIn={nextDueDateIn}
      />
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
    <div className="review-and-learn">
      {this.renderLinks(this.props.amountOfProblemsToLearn, this.props.amountOfProblemsToReview, this.props.courseId)}
      {this.renderAmountFooter(this.props.amountOfProblemsToLearn, this.props.amountOfProblemsToReview, this.props.nextDueDateIn)}
    </div>
}

export { ReviewAndLearn };
