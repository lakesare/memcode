import React from 'react';

import { Link, browserHistory } from 'react-router';

import { Loading } from '~/components/Loading';

import * as CourseApi from '~/api/Course';
import * as CourseUserIsLearningApi from '~/api/CourseUserIsLearning';

class Actions extends React.Component {
  static propTypes = {
    course: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      speIsLearningCourse: {},
      speDeleteCourse: {}
    };
  }

  apiDeleteCourse = () => {
    browserHistory.goBack();
    CourseApi.destroy(
      spe => this.setState({ speDeleteCourse: spe }),
      this.props.course.id
    );
  }

  apiAddToLearnedCourses = () =>
    CourseUserIsLearningApi.create(
      spe => this.setState({ speIsLearningCourse: spe }),
      this.props.course.id
    )

  render = () =>
    <section className="actions">
      <h3 className="course-title">{this.props.course.title}</h3>

      <a className="add-to-learned" onClick={this.apiAddToLearnedCourses}>
        <i className="fa fa-plus"/> TO LEARNED COURSES
      </a>

      <a>LEARN MODE</a>

      <Link className="edit" to={`/courses/${this.props.course.id}/edit`}>
        <i className="fa fa-pencil-square-o"/>
      </Link>

      <a className="remove" onClick={this.apiDeleteCourse}>
        {
          this.state.speDeleteCourse.status === 'loading' ?
            <i className="fa fa-circle-o-notch fa-spin fa-2x fa-fw" /> :
            <i className="fa fa-trash-o"/>
        }
      </a>
    </section>
}

export { Actions };
