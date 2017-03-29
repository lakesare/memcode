import React from 'react';

import { Link, browserHistory } from 'react-router';
import { Loading } from '~/components/Loading';
import { LearnAndReviewButtons } from '~/components/LearnAndReviewButtons';

import css from './index.css';

import * as CourseApi from '~/api/Course';
import * as CourseUserIsLearningApi from '~/api/CourseUserIsLearning';

//   'delete' (if owner) => just deletes it
//   'edit'   (if owner) => /courses/:id/edit
//   'review' (if learner) => /courses/:id/review
//   'learn'  (if learner) => switch to learn mode
//   'add to learned courses'/'remove from learned courses'/'resume learning this course' button
class Actions extends React.Component {
  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    currentUser: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      speGetCourse: {},
      speCourseUserIsLearning: {}
    };
  }

  componentDidMount = () => {
    CourseApi.show(
      spe => this.setState({ speGetCourse: spe }),
      this.props.courseId
    )
      .then(({ courseUserIsLearning }) => {
        this.setState({ speCourseUserIsLearning: { status: 'success', payload: courseUserIsLearning } });
      });
  }

  apiDeleteCourse = () => {
    CourseApi.destroy(() => {}, this.props.courseId);
    browserHistory.goBack();
  }

  apiStartLearning = () =>
    CourseUserIsLearningApi.create(
      spe => this.setState({ speCourseUserIsLearning: spe }),
      this.props.courseId
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

  canEdit = () =>
    this.state.speGetCourse.payload.course.userId === this.props.currentUser.id

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
    <Loading spe={this.state.speGetCourse}>{({ course, amountOfProblemsToReview, amountOfProblemsToLearn }) =>
      <section className={css.actions}>
        <h3 className="course-title">{course.title}</h3>

        <a className="add-to-learned">
          <Loading spe={this.state.speCourseUserIsLearning}>{(cuil) =>
            this.renderAddToLearned(cuil)
          }</Loading>
        </a>

        <LearnAndReviewButtons courseUserIsLearning={this.state.speCourseUserIsLearning.payload} amountOfProblemsToLearn={amountOfProblemsToLearn} amountOfProblemsToReview={amountOfProblemsToReview}/>

        {
          this.canEdit() &&
          <Link className="edit" to={`/courses/${course.id}/edit`}>
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
    }</Loading>
}

import { connect } from 'react-redux';
Actions = connect(
  (state) => ({
    currentUser: state.authentication.currentUser
  }),
  () => ({})
)(Actions);

export { Actions };
