import orFalse from '~/services/orFalse';
import stripTags from '~/services/stripTags';
import url from '~/services/url';

import { Link } from 'react-router-dom';
import StarRating from '~/components/StarRating';

import css from './index.scss';

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


      <section className="star-rating">
        <div className="star">★</div>
        <div className="number">{this.props.courseDto.averageCourseRating ? this.props.courseDto.averageCourseRating : false}</div>
      </section>

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
