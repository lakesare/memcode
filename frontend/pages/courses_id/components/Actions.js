import React from 'react';

import { Link, browserHistory } from 'react-router';

import { Loading } from '~/components/Loading';

import * as CourseApi from '~/api/Course';
import * as CourseUserIsLearningApi from '~/api/CourseUserIsLearning';


//   'delete' (if owner) => just deletes it
//   'edit'   (if owner) => /courses/:id/edit
//   'review'     (if learner) => /courses/:id/review
//   'learn mode' (if learner) => switch to learn mode
//   'add to learned courses'/'remove from learned courses'/'resume learning this course' button
class Actions extends React.Component {
  static propTypes = {
    course: React.PropTypes.object.isRequired,
    courseUserIsLearning: React.PropTypes.object,
    currentUser: React.PropTypes.object.isRequired
  }

  static defaultProps = {
    courseUserIsLearning: null
  }

  constructor(props) {
    super(props);
    this.state = {
      speCourseUserIsLearning: {
        status: 'success',
        payload: props.courseUserIsLearning
      },
    };
  }

  apiDeleteCourse = () => {
    CourseApi.destroy(() => {}, this.props.course.id);
    browserHistory.goBack();
  }

  apiStartLearning = () =>
    CourseUserIsLearningApi.create(
      spe => this.setState({ speCourseUserIsLearning: spe }),
      this.props.course.id
    )

  apiStopLearning = () =>
    CourseUserIsLearningApi.stopLearning(
      spe => this.setState({ speCourseUserIsLearning: spe }),
      this.state.speCourseUserIsLearning.payload.id
    )

  apiResumeLearning = () =>
    CourseUserIsLearningApi.resumeLearning(
      spe => this.setState({ speCourseUserIsLearning: spe }),
      this.state.speCourseUserIsLearning.payload.id
    )

  isCourseLearnedAndActive = () => {
    const courseUserIsLearning = this.state.speCourseUserIsLearning.payload;
    return courseUserIsLearning &&
    courseUserIsLearning.active;
  }

  canLearnMode = () => this.isCourseLearnedAndActive()
  canReview    = () => this.isCourseLearnedAndActive()
  canEdit      = () => this.props.course.userId === this.props.currentUser.id

  renderAddToLearned = (courseUserIsLearning) => {
    if (courseUserIsLearning === null) {
      return <div onClick={this.apiStartLearning}>
        <i className="fa fa-plus"/> TO LEARNED COURSES
      </div>;
    } else if (courseUserIsLearning.active) {
      return <div onClick={this.apiStopLearning}>
        STOP LEARNING
      </div>;
    } else if (!courseUserIsLearning.active) {
      return <div onClick={this.apiResumeLearning}>
        RESUME LEARNING
      </div>;
    }
  }

  render = () =>
    <section className="actions">
      <h3 className="course-title">{this.props.course.title}</h3>

      <a className="add-to-learned">
        <Loading spe={this.state.speCourseUserIsLearning}>{(courseUserIsLearning) =>
          this.renderAddToLearned(courseUserIsLearning)
        }</Loading>
      </a>

      {
        this.canLearnMode() &&
        <a>LEARN MODE</a>
      }

      {
        this.canReview() &&
        <Link className="review">
          REVIEW
        </Link>
      }

      {
        this.canEdit() &&
        <Link className="edit" to={`/courses/${this.props.course.id}/edit`}>
          <i className="fa fa-pencil-square-o"/>
        </Link>
      }

      {
        this.canEdit() &&
        <a className="remove" onClick={this.apiDeleteCourse}>
          <i className="fa fa-trash-o"/>
        </a>
      }
    </section>
}

import { connect } from 'react-redux';
Actions = connect(
  (state) => ({
    currentUser: state.authentication.currentUser
  }),
  () => ({})
)(Actions);

export { Actions };
