import orFalse from '~/services/orFalse';
import stripTags from '~/services/stripTags';
import url from '~/services/url';

import { Link } from 'react-router-dom';

import css from './index.css';

@connect((state) => ({
  currentUser: state.global.Authentication.currentUser
}))
class SimpleCourseCard extends React.Component {
  static propTypes = {
    currentUser: orFalse(PropTypes.object).isRequired,
    courseDto: PropTypes.shape({
      course: PropTypes.object.isRequired,
      amountOfProblems: PropTypes.number.isRequired,
      author: PropTypes.object.isRequired,
      courseCategory: PropTypes.object.isRequired,
      courseCategoryGroup: PropTypes.object.isRequired,
      averageCourseRating: PropTypes.string,
    }).isRequired
  }

  render = () =>
    <Link
      to={url.courseEditOrShow(this.props.currentUser, this.props.courseDto.course)}
      className={`course-card -simple ${css.a}`}
    >
      <section className="category-and-author">
        <div className="category">{this.props.courseDto.courseCategory.name === 'Programming Languages' ? 'Programming' : this.props.courseDto.courseCategory.name}</div>
        <div className="username">{this.props.courseDto.author.username}</div>
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

export default SimpleCourseCard;
