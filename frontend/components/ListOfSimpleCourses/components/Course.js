import { Link } from 'react-router';
import { stripTags } from '~/services/stripTags';
import { url } from '~/services/url';

import StarRating from '~/components/StarRating';

@connect((state) => ({
  currentUser: state.global.Authentication.currentUser || undefined
}))
class Course extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
    currentUser: PropTypes.object,
    amountOfProblems: PropTypes.number.isRequired,
    averageCourseRating: PropTypes.string
  }

  static defaultProps = {
    currentUser: null,
    averageCourseRating: null
  }

  render = () =>
    <Link
      to={url.courseEditOrShow(this.props.currentUser, this.props.course)}
      className="course -simpleCourse"
    >
      <div className="actions"><i className="fa fa-long-arrow-right"/></div>

      <section className="main">
        <h3 className="title">{this.props.course.title}</h3>

        <article
          className="description"
          dangerouslySetInnerHTML={{
            __html: stripTags(this.props.course.description)
          }}
        />
      </section>

      <div>
        <StarRating
          rating={this.props.averageCourseRating ? parseFloat(this.props.averageCourseRating) : false}
          readOnly
        />
      </div>

      <section className="total-amount-of-mems">
        {this.props.amountOfProblems} flashcards
      </section>
    </Link>
}

export { Course };
