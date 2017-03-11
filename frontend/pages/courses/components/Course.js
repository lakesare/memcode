import React from 'react';
import { Link } from 'react-router';

import * as CourseApi from '~/api/Course';

class Course extends React.Component {
  static propTypes = {
    course: React.PropTypes.object.isRequired,
  }

  apiDeleteCourse = () => {
    CourseApi.destroy(
      spe => this.setState({ speDeleteCourse: spe }),
      this.props.course.id
    );
  }

  render = () => {
    const course = this.props.course;

    return (
      <div className="course">
        <section className="actions">
          <Link
            className="edit"
            to={'/courses/' + course.id + '/edit'}
          >
            <i className="fa fa-pencil-square-o"/>
          </Link>
          <a
            className="delete"
            onClick={this.apiDeleteCourse}
          >
            <i className="fa fa-trash-o" />
          </a>
        </section>

        <section className="details">
          <Link to={'/courses/' + course.id} className="link">
            <h5 className="title">{course.title}</h5>

            <div className="additional-information">
              {course.amountOfProblems} mems
            </div>
          </Link>
        </section>
      </div>
    );
  }
}

export { Course };
