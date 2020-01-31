import UrlCreator from '~/services/UrlCreator';

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
      nextDueDateIn: PropTypes.object,
      courseCategory: PropTypes.object,
      author: PropTypes.object
    })
  }

  static defaultProps = {
    courseUserIsLearning: null,
    nextDueDateIn: null // because courseUserIsLearning can be null
  }

  ifCanLearnAndReview = () =>
    true

  ifThereIsSomethingToLearnAndReview = () =>
    this.ifCanLearnAndReview() &&
    (
      this.props.courseDto.amountOfProblemsToReview > 0 ||
      this.props.courseDto.amountOfProblemsToLearn > 0
    )

  renderGo = (course) =>
    <Link
      className="go"
      to={UrlCreator.courseEditOrShow(this.props.currentUser, course)}
      // do not focus the entire card on tab if there is something to review or to learn,
      // because it's faster to tab through learn/review links!
      tabIndex={this.ifThereIsSomethingToLearnAndReview() ? -1 : 0}
    >
      <i className="fa fa-long-arrow-right"/>
    </Link>

  render = () =>
    <div className={"standard-course-card -learnReviewCourse " + css.CourseCardLearnReview}>
      {this.renderGo(this.props.courseDto.course)}

      <div className="main">
        <section className="category_and_author">
          <div className="category">{this.props.courseDto.courseCategory.name === 'Programming Languages' ? 'Programming' : this.props.courseDto.courseCategory.name}</div>
          <div className="author">{this.props.courseDto.author.username}</div>
        </section>

        <h2 className="title">{this.props.courseDto.course.title}</h2>

        {
          this.ifCanLearnAndReview() &&
          <LearnAndReviewButtons
            courseId={this.props.courseDto.course.id}
            amountOfProblemsToReview={this.props.courseDto.amountOfProblemsToReview}
            amountOfProblemsToLearn={this.props.courseDto.amountOfProblemsToLearn}
            nextDueDateIn={this.props.courseDto.nextDueDateIn}
          />
        }
      </div>
    </div>
}

export default CourseCardLearnReview;
