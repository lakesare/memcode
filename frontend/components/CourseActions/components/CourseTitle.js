import React from 'react';

import { Link } from 'react-router';

class CourseTitle extends React.Component {
  static propTypes = {
    course: React.PropTypes.object.isRequired,
  }

  render = () =>
    <h3 className="course-title">
      <Link to={`/courses/${this.props.course.id}`}>
        {this.props.course.title}
      </Link>
    </h3>
}

export { CourseTitle };
