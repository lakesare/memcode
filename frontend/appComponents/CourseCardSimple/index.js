import orFalse from '~/services/orFalse';
import stripTags from '~/services/stripTags';
import UrlCreator from '~/services/UrlCreator';

import { Link } from 'react-router-dom';

import css from './index.css';

@connect((state) => ({
  currentUser: state.global.Authentication.currentUser
}))
class CourseCardSimple extends React.Component {
  static propTypes = {
    currentUser: orFalse(PropTypes.object).isRequired,
    courseDto: PropTypes.shape({
      course: PropTypes.object.isRequired,
      amountOfProblems: PropTypes.number.isRequired,
      author: PropTypes.object.isRequired,
      courseCategory: PropTypes.object.isRequired,
      averageCourseRating: PropTypes.string,
    }).isRequired
  }

  render = () =>
    <Link
      to={UrlCreator.courseEditOrShow(this.props.currentUser, this.props.courseDto.course)}
      className={`standard-course-card -simple ${css.a}`}
    >
      <section className="category_and_author">
        <div className="category">{this.props.courseDto.courseCategory.name === 'Programming Languages' ? 'Programming' : this.props.courseDto.courseCategory.name}</div>
        <div className="author">{this.props.courseDto.author.username}</div>
      </section>

      <h2 className="title">{this.props.courseDto.course.title}</h2>

      <div
        className="description"
        dangerouslySetInnerHTML={{
          __html: stripTags(this.props.courseDto.course.description)
        }}
      />

      <section className="total-amount-of-flashcards">
        {this.props.courseDto.amountOfProblems} flashcards
      </section>
    </Link>
}

export default CourseCardSimple;
