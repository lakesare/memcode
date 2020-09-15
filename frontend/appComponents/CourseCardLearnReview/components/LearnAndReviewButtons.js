import { Link } from 'react-router-dom';
import MyModel from '~/models/MyModel';

class LearnAndReviewButtons extends React.Component {
  static propTypes = {
    courseDto: PropTypes.shape({
      course: PropTypes.object.isRequired,
      amountOfProblemsToLearn: PropTypes.number.isRequired,
      amountOfProblemsToReview: PropTypes.number.isRequired,
      nextDueDate: PropTypes.string
    })
  }

  renderAmountOfProblemsToReview = (courseDto) => {
    const nextDueDateIn = MyModel.getNextDueDateIn(courseDto);
    // user will have to review some problems soon
    if (courseDto.amountOfProblemsToReview === 0 && nextDueDateIn) {
      return <div className="review -zero">
        <i className="material-icons timer-icon">timer</i>
        {MyModel.nextDueDateInToString(nextDueDateIn)}
      </div>;
    // user has problems to review
    } else if (courseDto.amountOfProblemsToReview > 0) {
      return <div className="review -nonzero">
        {courseDto.amountOfProblemsToReview} to review
      </div>;
    } else {
      return null;
    }
  }

  renderAmountFooter = (courseDto) =>
    <section className="amount-footer">
      {
        courseDto.amountOfProblemsToLearn > 0 &&
        <div className="learn -nonzero">
          {courseDto.amountOfProblemsToLearn} to learn
        </div>
      }
      {this.renderAmountOfProblemsToReview(courseDto)}
    </section>

  renderLinks = (courseDto) =>
    <section className="links">
      {
        courseDto.amountOfProblemsToLearn > 0 &&
        <Link
          className={`learn ${courseDto.amountOfProblemsToLearn === 0 ? '-zero' : '-nonzero'}`}
          to={`/courses/${courseDto.course.id}/learn`}
        >
          LEARN
        </Link>
      }

      {
        courseDto.amountOfProblemsToReview > 0 &&
        <Link className="review" to={`/courses/${courseDto.course.id}/review`}>
          REVIEW
        </Link>
      }
    </section>

  render = () =>
    <div className="learn-and-review-buttons">
      {this.renderLinks(this.props.courseDto)}
      {this.renderAmountFooter(this.props.courseDto)}
    </div>
}

export default LearnAndReviewButtons;
