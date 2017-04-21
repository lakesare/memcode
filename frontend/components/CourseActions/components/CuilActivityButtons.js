import React from 'react';

import { Loading } from '~/components/Loading';

import * as CourseUserIsLearningApi from '~/api/CourseUserIsLearning';

class CuilActivityButtons extends React.Component {
  static propTypes = {
    courseId: React.PropTypes.number.isRequired,
    speCourseUserIsLearning: React.PropTypes.object.isRequired,
    seedSpeCourseUserIsLearning: React.PropTypes.func.isRequired
  }

  apiStartLearning = () =>
    CourseUserIsLearningApi.create(
      spe => this.props.seedSpeCourseUserIsLearning(spe),
      this.props.courseId
    )

  apiStopLearning = () =>
    CourseUserIsLearningApi.stopLearning(
      spe => this.props.seedSpeCourseUserIsLearning(spe),
      this.props.speCourseUserIsLearning.payload.id
    )

  apiResumeLearning = () =>
    CourseUserIsLearningApi.resumeLearning(
      spe => this.props.seedSpeCourseUserIsLearning(spe),
      this.props.speCourseUserIsLearning.payload.id
    )

  renderStartLearningButton = () =>
    <div onClick={this.apiStartLearning}>
      <i className="fa fa-plus"/> TO LEARNED COURSES
    </div>

  renderStopLearningButton = () =>
    <div onClick={this.apiStopLearning}>
      STOP LEARNING
    </div>

  renderResumeLearningButton = () =>
    <div onClick={this.apiResumeLearning}>
      RESUME LEARNING
    </div>

  render = () =>
    <a className="add-to-learned">
      <Loading spe={this.props.speCourseUserIsLearning} requestIcon={<i className="fa fa-circle-o-notch fa-spin fa-2x fa-fw"/>}>{(cuil) => {
        if (cuil === null) {
          return this.renderStartLearningButton();
        } else if (cuil.active) {
          return this.renderStopLearningButton();
        } else if (!cuil.active) {
          return this.renderResumeLearningButton();
        }
      }}</Loading>
    </a>
}

import { connect } from 'react-redux';
CuilActivityButtons = connect(
  (state) => ({
    speCourseUserIsLearning: state.components.CourseActions.speCourseUserIsLearning
  }),
  (dispatch) => ({
    seedSpeCourseUserIsLearning: (spe) => dispatch({
      type: 'SEED_SPE_COURSE_USER_IS_LEARNING',
      payload: spe
    })
  })
)(CuilActivityButtons);

export { CuilActivityButtons };
