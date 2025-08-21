import Urls from '~/services/Urls';

import { Link } from 'react-router-dom';
import LearnAndReviewButtons from './components/LearnAndReviewButtons';

import css from './index.scss';

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
      nextDueDate: PropTypes.string,
      courseCategory: PropTypes.object,
      author: PropTypes.object
    })
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
      to={Urls.courseShow(course.id)}
      // do not focus the entire card on tab if there is something to review or to learn,
      // because it's faster to tab through learn/review links!
      tabIndex={this.ifThereIsSomethingToLearnAndReview() ? -1 : 0}
    >
      <i className="fa fa-long-arrow-right"/>
    </Link>

  renderMain = (courseDto) =>
    <div className="main">
      <section className="category_and_author">
        <div className="category">{courseDto.courseCategory.name === 'Programming Languages' ? 'Programming' : courseDto.courseCategory.name}</div>
        <div className="author">{courseDto.author.username}</div>
      </section>

      <h2 className="title">{courseDto.course.title}</h2>

      {
        this.ifCanLearnAndReview() &&
        <LearnAndReviewButtons courseDto={courseDto}/>
      }
    </div>

  render = () => {
    const className = "standard-course-card -learnReviewCourse " + css.CourseCardLearnReview;
    const courseDto = this.props.courseDto;

    if (courseDto.amountOfProblemsToReview === 0 && courseDto.amountOfProblemsToLearn === 0) {
      return (
        <Link
          className={className + ' -focusable-link'}
          to={Urls.courseShow(courseDto.course.id)}
        >
          <div className="go"><i className="fa fa-long-arrow-right"/></div>
          {this.renderMain(courseDto)}
        </Link>
      );
    } else {
      return (
        <div className={className}>
          {this.renderGo(courseDto.course)}
          {this.renderMain(courseDto)}
        </div>
      );
    }
  }
}

export default CourseCardLearnReview;
