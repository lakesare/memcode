import React from 'react';

import { Loading } from '~/components/Loading';
import { CourseTitle } from './components/CourseTitle';
import { LearnAndReviewButtons } from './components/LearnAndReviewButtons';
import { CuilActivityButtons } from './components/CuilActivityButtons';
import { EditButton } from './components/EditButton';
import { MetaTags } from './components/MetaTags';

import css from './index.css';

import { commonFetch } from '~/api/commonFetch';

class CourseActions extends React.Component {
  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    currentUser: React.PropTypes.object,

    speGetCourse: React.PropTypes.object.isRequired,
    speCourseUserIsLearning: React.PropTypes.object.isRequired,

    seedSpeGetCourse: React.PropTypes.func.isRequired,

    ifCuilActivityButtonsAreDisplayed: React.PropTypes.bool,
    ifCourseDescriptionIsDisplayed: React.PropTypes.bool
  }

  static defaultProps = {
    currentUser: null,
    ifCuilActivityButtonsAreDisplayed: true,
    ifCourseDescriptionIsDisplayed: false
  }

  componentDidMount = () => {
    this.props.currentUser ?
      commonFetch(
        (spe) => this.props.seedSpeGetCourse(spe),
        'GET', `/api/pages/courseActions/${this.props.courseId}/authenticated`
      )
      :
      commonFetch(
        (spe) => this.props.seedSpeGetCourse(spe),
        'GET', `/api/pages/courseActions/${this.props.courseId}/unauthenticated`
      );
  }

  render = () =>
    <Loading spe={this.props.speGetCourse} requestIcon={null}>{({ course, amountOfProblemsToReview, amountOfProblemsToLearn }) =>
      <section className={css.actions}>
        <section className="title-and-buttons">
          <CourseTitle course={course}/>

          {
            this.props.currentUser ?
              <div className="buttons">
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
              </div> :
              <h4>Sign in to start learning this course</h4>
          }
        </section>

        {
          this.props.ifCourseDescriptionIsDisplayed &&
          course.description &&
          course.description.length > 0 &&
          <section
            className="course-description"
            dangerouslySetInnerHTML={{ __html: course.description }}
          />
        }

        <MetaTags title={course.title} description={course.description}/>
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
