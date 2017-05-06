import { Link } from 'react-router';

class EditButton extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
    currentUserId: PropTypes.number.isRequired
  }

  ifCanEdit = () =>
    this.props.course.userId === this.props.currentUserId

  render = () =>
    this.ifCanEdit() &&
    <Link className="action -edit" to={`/courses/${this.props.course.id}/edit`}>
      <i className="fa fa-pencil-square-o"/>
    </Link>
}

export { EditButton };
