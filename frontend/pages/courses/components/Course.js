import { Link } from 'react-router';
import { stripTags } from '~/services/stripTags';

class Course extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
    amountOfProblems: PropTypes.string.isRequired
  }

  render = () =>
    <Link to={`/courses/${this.props.course.id}`} className="course">
      <section className="actions">
        <div className="action -view">
          <i className="fa fa-eye"/>
        </div>
      </section>

      <section className="main">
        <h3 className="title">{this.props.course.title}</h3>

        <article className="description">{stripTags(this.props.course.description)}</article>
      </section>

      <section className="total-amount-of-mems">
        {this.props.amountOfProblems} mems
      </section>
    </Link>
}

export { Course };
