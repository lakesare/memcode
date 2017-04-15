import React from 'react';

import { Loading } from '~/components/Loading';
import { CourseTitle } from './components/CourseTitle';
import { LearnAndReviewButtons } from './components/LearnAndReviewButtons';
import { CuilActivityButtons } from './components/CuilActivityButtons';
import { EditButton } from './components/EditButton';

import css from './index.css';

import * as CourseApi from '~/api/Course';

class CourseActions extends React.Component {
  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    currentUser: React.PropTypes.object.isRequired,

    speGetCourse: React.PropTypes.object.isRequired,
    speCourseUserIsLearning: React.PropTypes.object.isRequired,

    seedSpeGetCourse: React.PropTypes.func.isRequired,

    ifCuilActivityButtonsAreDisplayed: React.PropTypes.bool
  }

  static defaultProps = {
    ifCuilActivityButtonsAreDisplayed: true
  }

  componentDidMount = () => {
    CourseApi.show(
      spe => this.props.seedSpeGetCourse(spe),
      this.props.courseId
    );
  }

  render = () =>
    <Loading spe={this.props.speGetCourse} requestIcon={null}>{({ course, amountOfProblemsToReview, amountOfProblemsToLearn }) =>
      <section className={css.actions}>
        <CourseTitle course={course}/>

        {
          this.props.ifCuilActivityButtonsAreDisplayed &&
          <CuilActivityButtons speCourseUserIsLearning={this.props.speCourseUserIsLearning} courseId={course.id}/>
        }

        <LearnAndReviewButtons
          courseUserIsLearning={this.props.speCourseUserIsLearning.payload}
          amountOfProblemsToLearn={amountOfProblemsToLearn}
          amountOfProblemsToReview={amountOfProblemsToReview}
        />

        <EditButton course={course} currentUserId={this.props.currentUser.id}/>
      </section>
    }</Loading>
}

import { connect } from 'react-redux';
CourseActions = connect(
  (state) => ({
    currentUser: state.global.Authentication.currentUser,
    speGetCourse: state.components.CourseActions.speGetCourse,
    speCourseUserIsLearning: state.components.CourseActions.speCourseUserIsLearning
  }),
  (dispatch) => ({
    seedSpeGetCourse: (spe) => dispatch({
      type: 'SEED_SPE_GET_COURSE',
      payload: spe
    })
  })
)(CourseActions);

export { CourseActions };
