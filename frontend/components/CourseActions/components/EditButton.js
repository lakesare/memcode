import React from 'react';

import { Link } from 'react-router';

class EditButton extends React.Component {
  static propTypes = {
    course: React.PropTypes.object.isRequired,
    currentUserId: React.PropTypes.number.isRequired
  }

  ifCanEdit = () =>
    this.props.course.userId === this.props.currentUserId

  render = () =>
    this.ifCanEdit() &&
    <Link className="edit" to={`/courses/${this.props.course.id}/edit`}>
      <i className="fa fa-pencil-square-o"/>
    </Link>
}

export { EditButton };
