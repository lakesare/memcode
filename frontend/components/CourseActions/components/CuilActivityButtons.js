import { Loading } from '~/components/Loading';

import * as CourseUserIsLearningApi from '~/api/CourseUserIsLearning';
import { IdsOfProblemsToLearnAndReviewPerCourseActions } from '~/reducers/IdsOfProblemsToLearnAndReviewPerCourse';

import StandardTooltip from '~/components/StandardTooltip';

@connect(
  (state) => ({
    speCourseUserIsLearning: state.components.CourseActions.speCourseUserIsLearning
  }),
  (dispatch) => ({
    seedSpeCourseUserIsLearning: (spe) => dispatch({
      type: 'SEED_SPE_COURSE_USER_IS_LEARNING',
      payload: spe
    }),
    IdsOfProblemsToLearnAndReviewPerCourseActions: {
      stopLearningCourse: (courseId) => IdsOfProblemsToLearnAndReviewPerCourseActions.stopLearningCourse(dispatch, courseId),
      apiSync: () => IdsOfProblemsToLearnAndReviewPerCourseActions.apiSync(dispatch)
    }
  })
)
class CuilActivityButtons extends React.Component {
  static propTypes = {
    courseId: PropTypes.number.isRequired,
    speCourseUserIsLearning: PropTypes.object.isRequired,
    seedSpeCourseUserIsLearning: PropTypes.func.isRequired,
    IdsOfProblemsToLearnAndReviewPerCourseActions: PropTypes.shape({
      stopLearningCourse: PropTypes.func.isRequired,
      apiSync: PropTypes.func.isRequired
    }).isRequired
  }

  apiStartLearning = () =>
    CourseUserIsLearningApi.create(
      (spe) => this.props.seedSpeCourseUserIsLearning(spe),
      this.props.courseId
    )
      .then(this.props.IdsOfProblemsToLearnAndReviewPerCourseActions.apiSync)

  apiStopLearning = () =>
    CourseUserIsLearningApi.stopLearning(
      (spe) => this.props.seedSpeCourseUserIsLearning(spe),
      this.props.speCourseUserIsLearning.payload.id
    )
      .then(() => {
        this.props.IdsOfProblemsToLearnAndReviewPerCourseActions.stopLearningCourse(this.props.courseId);
      })

  apiResumeLearning = () =>
    CourseUserIsLearningApi.resumeLearning(
      (spe) => this.props.seedSpeCourseUserIsLearning(spe),
      this.props.speCourseUserIsLearning.payload.id
    )
      .then(this.props.IdsOfProblemsToLearnAndReviewPerCourseActions.apiSync)

  renderStartLearningButton = () =>
    <StandardTooltip tooltipEl="We will be recording your results, and asking you to repeat flashcards when necessary!">
      <button className="button start-learning-button" type="button" onClick={this.apiStartLearning}>
        <i className="fa fa-plus"/> TO LEARNED COURSES
      </button>
    </StandardTooltip>

  renderStopLearningButton = () =>
    <StandardTooltip tooltipEl="If you stop learning this course, you will not be asked to review flashcards from it again. But you can always resume learning it!">
      <button className="button stop-learning-button" type="button" onClick={this.apiStopLearning}>
        STOP LEARNING
      </button>
    </StandardTooltip>

  renderResumeLearningButton = () =>
    <StandardTooltip tooltipEl="All of your results are saved! Just click resume and return to learning a course.">
      <button className="button resume-learning-button" type="button" onClick={this.apiResumeLearning}>
        RESUME LEARNING
      </button>
    </StandardTooltip>

  render = () =>
    <section className="start-stop-or-resume-learning-course">
      <Loading spe={this.props.speCourseUserIsLearning} requestIcon={<i className="fa fa-circle-o-notch fa-spin fa-2x fa-fw"/>}>{(cuil) => {
        if (cuil === null) {
          return this.renderStartLearningButton();
        } else if (cuil.active) {
          return this.renderStopLearningButton();
        } else if (!cuil.active) {
          return this.renderResumeLearningButton();
        }
      }}</Loading>
    </section>
}

export { CuilActivityButtons };
