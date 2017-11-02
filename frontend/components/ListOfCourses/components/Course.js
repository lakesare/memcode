import { Link } from 'react-router';
import { ReviewAndLearn } from './ReviewAndLearn';

import { stripTags } from '~/services/stripTags';

@connect((state) => ({
  currentUser: state.global.Authentication.currentUser
}))
class Course extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,

    amountOfProblemsToLearn: PropTypes.number.isRequired,
    amountOfProblemsToReview: PropTypes.number.isRequired,
    amountOfProblems: PropTypes.number.isRequired,
    courseUserIsLearning: PropTypes.object,
    nextDueDateIn: PropTypes.object
  }

  static defaultProps = {
    courseUserIsLearning: null,
    nextDueDateIn: null // because courseUserIsLearning can be null
  }

  ifCanEdit = () =>
    this.props.currentUser.id === this.props.course.userId

  ifCanLearnAndReview = () =>
    this.props.courseUserIsLearning &&
    this.props.courseUserIsLearning.active === true

  renderGo = (course) =>
    <Link
      className="actions"
      to={
        this.ifCanEdit() ?
        `/courses/${course.id}/edit` :
        `/courses/${course.id}`
      }
    ><i className="fa fa-long-arrow-right"/></Link>

  render = () =>
    <div className="course -learnReviewCourse">
      {this.renderGo(this.props.course)}

      <section className="main">
        <h3 className="title">{this.props.course.title}</h3>

        <article className="description">{stripTags(this.props.course.description)}</article>

        {
          this.ifCanLearnAndReview() &&
          <ReviewAndLearn
            courseId={this.props.course.id}
            amountOfProblemsToReview={this.props.amountOfProblemsToReview}
            amountOfProblemsToLearn={this.props.amountOfProblemsToLearn}
            nextDueDateIn={this.props.nextDueDateIn}
          />
        }
      </section>

      <section className="total-amount-of-mems">
        {this.props.amountOfProblems} flashcards
      </section>
    </div>
}

export { Course };
