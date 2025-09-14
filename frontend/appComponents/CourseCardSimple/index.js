import stripTags from '~/services/stripTags';
import Urls from '~/services/Urls';

import { Link } from 'react-router-dom';

import css from './index.scss';

class CourseCardSimple extends React.Component {
  static propTypes = {
    courseDto: PropTypes.shape({
      course: PropTypes.object.isRequired,
      amountOfProblems: PropTypes.number.isRequired,
      author: PropTypes.object.isRequired,
      courseCategory: PropTypes.object.isRequired,
      averageCourseRating: PropTypes.string,
    }).isRequired,
    ifShowSimulatedReviewButton: PropTypes.bool,
    ifShowPersistentReviewButton: PropTypes.bool
  }

  static defaultProps = {
    ifShowSimulatedReviewButton: false,
    ifShowPersistentReviewButton: false
  }

  getUrl = () => {
    if (this.props.ifShowSimulatedReviewButton) {
      return Urls.courseReviewSimulated(this.props.courseDto.course.id);
    } else if (this.props.ifShowPersistentReviewButton) {
      return Urls.courseReviewPersistent(this.props.courseDto.course.id);
    } else {
      return Urls.courseShow(this.props.courseDto.course.id);
    }
  }

  getDisplayTitle = () => {
    const title = this.props.courseDto.course.title;
    // Remove (Animals) from the title for display purposes
    return title.replace(/\s*\(Animals\)\s*/gi, '').trim();
  }

  render = () =>
    <Link
      to={this.getUrl()}
      className={`standard-course-card -simple ${css.a}`}
    >
      <section className="category_and_author">
        <div className="category">{this.props.courseDto.courseCategory.name === 'Programming Languages' ? 'Programming' : this.props.courseDto.courseCategory.name}</div>
        <div className="author">{this.props.courseDto.author.username}</div>
      </section>

      <h2 className="title">{this.getDisplayTitle().toLowerCase()}</h2>

      <div
        className="description"
        dangerouslySetInnerHTML={{
          __html: stripTags(this.props.courseDto.course.description)
        }}
      />

      {
        // this.props.ifShowSimulatedReviewButton &&
        // <Link to={`/courses/${this.props.courseDto.course.id}/review/simulated`} className="button -orange play-button" type="button">PLAY</Link>
      }

      {
        this.props.ifShowSimulatedReviewButton || this.props.ifShowPersistentReviewButton ?
          <section className="total-amount-of-flashcards">
            PLAY
          </section> :
          <section className="total-amount-of-flashcards">
            {this.props.courseDto.amountOfProblems} flashcards
          </section>
      }
    </Link>
}

export default CourseCardSimple;
