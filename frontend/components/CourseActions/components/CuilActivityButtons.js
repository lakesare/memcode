import Loading from '~/components/Loading';

import CourseUserIsLearningApi from '~/api/CourseUserIsLearning';

import StandardTooltip from '~/components/StandardTooltip';

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

  apiResumeLearning = () =>
    CourseUserIsLearningApi.resumeLearning(
      (spe) => this.props.seedSpeCourseUserIsLearning(spe),
      this.props.speCourseUserIsLearning.payload.id
    )
      .then(this.props.IdsOfProblemsToLearnAndReviewPerCourseActions.apiSync)

  getTooltipProps = () => ({
    tooltipProps: {
      delay: 1000,
      animation: 'fade',
      duration: 600
    }
  })

  renderStartLearningButton = () =>
    <StandardTooltip {...this.getTooltipProps()} tooltipEl="We will be recording your results, and asking you to repeat flashcards when necessary!">
      <button className="button -purple start-learning-button" type="button" onClick={this.apiStartLearning}>
        <i className="fa fa-plus"/> TO LEARNED COURSES
      </button>
    </StandardTooltip>

  renderResumeLearningButton = () =>
    <StandardTooltip {...this.getTooltipProps()} tooltipEl="All of your results are saved! Just click resume and return to learning a course.">
      <button className="button -purple resume-learning-button" type="button" onClick={this.apiResumeLearning}>
        RESUME LEARNING
      </button>
    </StandardTooltip>

  render = () =>
    <section className="start-stop-or-resume-learning-course">
      <Loading spe={this.props.speCourseUserIsLearning} requestIcon={<i className="fa fa-circle-o-notch fa-spin fa-2x fa-fw"/>}>{(cuil) => {
        if (cuil === null) {
          return this.renderStartLearningButton();
        } else if (!cuil.active) {
          return this.renderResumeLearningButton();
        } else {
          return null;
        }
      }}</Loading>
    </section>
}

export { CuilActivityButtons };
