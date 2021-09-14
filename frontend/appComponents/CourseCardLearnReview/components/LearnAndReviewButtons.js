import { Link } from 'react-router-dom';
import MyModel from '~/models/MyModel';

class LearnAndReviewButtons extends React.Component {
  static propTypes = {
    courseDto: PropTypes.shape({
      course: PropTypes.object.isRequired,
      amountOfProblemsToLearn: PropTypes.number.isRequired,
      amountOfProblemsToReview: PropTypes.number.isRequired,
    })
  }

  renderToReview = (n) =>
    <div className="learn-and-review-buttons">
      <Link className="link -review" to={`/courses/${this.props.courseDto.course.id}/review`}>
        REVIEW
      </Link>
      <section className="amount-footer -review">
        {n}
      </section>
    </div>

  renderToLearn = (n) =>
    <div className="learn-and-review-buttons">
      <Link
        className="link -learn"
        to={`/courses/${this.props.courseDto.course.id}/learn`}
      >
        LEARN
      </Link>
      <section className="amount-footer -learn">
        {n} to learn
      </section>
    </div>

  renderNextDue = (nextDueDateIn) =>
    <div className="learn-and-review-buttons">
      <section className="amount-footer -next-due">
        <i className="material-icons timer-icon">timer</i>
        {MyModel.nextDueDateInToString(nextDueDateIn)}
      </section>
    </div>

  render = () => {
    const courseDto = this.props.courseDto;
    const nextDueDateIn = MyModel.getNextDueDateIn(courseDto);

    if (courseDto.amountOfProblemsToReview) {
      return this.renderToReview(courseDto.amountOfProblemsToReview);
    } else if (courseDto.amountOfProblemsToLearn) {
      return this.renderToLearn(courseDto.amountOfProblemsToLearn);
    } else if (nextDueDateIn) {
      return this.renderNextDue(nextDueDateIn);
    } else {
      return null;
    }
  }
}

export default LearnAndReviewButtons;
