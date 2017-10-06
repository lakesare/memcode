import { Link } from 'react-router';
import { stripTags } from '~/services/stripTags';

@connect((state) => ({
  currentUser: state.global.Authentication.currentUser || undefined
}))
class Course extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
    amountOfProblems: PropTypes.string.isRequired,
    currentUser: PropTypes.object
  }

  static defaultProps = {
    currentUser: null
  }

  ifCanEdit = () =>
    this.props.currentUser &&
    this.props.currentUser.id === this.props.course.userId

  render = () =>
    <Link
      to={
        this.ifCanEdit() ?
        `/courses/${this.props.course.id}/edit` :
        `/courses/${this.props.course.id}`
      }
      className="course"
    >
      <div className="actions"><i className="fa fa-long-arrow-right"/></div>

      <section className="main">
        <h3 className="title">{this.props.course.title}</h3>

        <article className="description">{stripTags(this.props.course.description)}</article>
      </section>

      <section className="total-amount-of-mems">
        {this.props.amountOfProblems} flashcards
      </section>
    </Link>
}

export { Course };
