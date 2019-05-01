import stripTags from '~/services/stripTags';

import { Link } from 'react-router-dom';
import LearnAndReviewButtons from './components/LearnAndReviewButtons';

import css from './index.css';

@connect((state) => ({
  currentUser: state.global.Authentication.currentUser
}))
class CourseCardLearnReview extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,

    courseDto: PropTypes.shape({
      course: PropTypes.object.isRequired,
      amountOfProblemsToLearn: PropTypes.number.isRequired,
      amountOfProblemsToReview: PropTypes.number.isRequired,
      amountOfProblems: PropTypes.number.isRequired,
      courseUserIsLearning: PropTypes.object,
      nextDueDateIn: PropTypes.object
    })
  }

  static defaultProps = {
    courseUserIsLearning: null,
    nextDueDateIn: null // because courseUserIsLearning can be null
  }

  ifCanEdit = () =>
    this.props.currentUser.id === this.props.courseDto.course.userId

  ifCanLearnAndReview = () =>
    this.props.courseDto.courseUserIsLearning &&
    this.props.courseDto.courseUserIsLearning.active === true

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
    <div className={"course -learnReviewCourse " + css.div}>
      {this.renderGo(this.props.courseDto.course)}

      <section className="main">
        <h3 className="title">{this.props.courseDto.course.title}</h3>

        <article
          className="description"
          dangerouslySetInnerHTML={{
            __html: stripTags(this.props.courseDto.course.description)
          }}
        />

        {
          this.ifCanLearnAndReview() &&
          <LearnAndReviewButtons
            courseId={this.props.courseDto.course.id}
            amountOfProblemsToReview={this.props.courseDto.amountOfProblemsToReview}
            amountOfProblemsToLearn={this.props.courseDto.amountOfProblemsToLearn}
            nextDueDateIn={this.props.courseDto.nextDueDateIn}
          />
        }
      </section>

      <section className="total-amount-of-mems">
        {this.props.courseDto.amountOfProblems} flashcards
      </section>
    </div>
}

export default CourseCardLearnReview;
