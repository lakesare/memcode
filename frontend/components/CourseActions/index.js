import { orFalse } from '~/services/orFalse';
import { commonFetch } from '~/api/commonFetch';
import { url } from '~/services/url';

import { MetaTags } from './components/MetaTags';
import { Link } from 'react-router';
import { Loading } from '~/components/Loading';
import Breadcrumbs from './components/Breadcrumbs';
import CourseModal from './components/CourseModal';
import { LearnAndReviewButtons } from './components/LearnAndReviewButtons';
import { CuilActivityButtons } from './components/CuilActivityButtons';
import { CourseDescriptionAndStats } from './components/CourseDescriptionAndStats';

import css from './index.css';

@connect(
  (state, ownProps) => ({
    currentUser: state.global.Authentication.currentUser || false,
    speGetCourse: state.components.CourseActions.speGetCourse,
    speCourseUserIsLearning: state.components.CourseActions.speCourseUserIsLearning,
    amountOfProblems:
      (
        state.global.IdsOfProblemsToLearnAndReviewPerCourse &&
        state.global.IdsOfProblemsToLearnAndReviewPerCourse[ownProps.courseId]
      ) ?
      {
        toLearn: state.global.IdsOfProblemsToLearnAndReviewPerCourse[ownProps.courseId].toLearn.length,
        toReview: state.global.IdsOfProblemsToLearnAndReviewPerCourse[ownProps.courseId].toReview.length
      } :
      false
  }),
  (dispatch) => ({
    seedSpeGetCourse: (spe) => dispatch({
      type: 'SEED_SPE_GET_COURSE',
      payload: spe
    })
  })
)
class CourseActions extends React.Component {
  static propTypes = {
    courseId: PropTypes.string.isRequired,
    currentUser: orFalse(PropTypes.object).isRequired,
    amountOfProblems: orFalse(PropTypes.object).isRequired,

    speGetCourse: PropTypes.object.isRequired,
    speCourseUserIsLearning: PropTypes.object.isRequired,

    seedSpeGetCourse: PropTypes.func.isRequired,

    ifCuilActivityButtonsAreDisplayed: PropTypes.bool,
    ifCourseDescriptionIsDisplayed: PropTypes.bool,
    ifEditCourseModalTogglerIsDisplayed: PropTypes.bool,
    ifBreadcrumbsAreDisplayed: PropTypes.bool,
    ifConfused: PropTypes.bool
  }

  static defaultProps = {
    currentUser: false,
    ifCuilActivityButtonsAreDisplayed: true,
    ifCourseDescriptionIsDisplayed: false,
    ifEditCourseModalTogglerIsDisplayed: false,
    ifBreadcrumbsAreDisplayed: false,
    ifConfused: false
  }

  componentDidMount = () =>
    commonFetch(
      (spe) => this.props.seedSpeGetCourse(spe),
      'GET', `/api/pages/courseActions/${this.props.courseId}`
    )

  uiUpdateCourse = (course) => {
    const spe = this.props.speGetCourse;
    this.props.seedSpeGetCourse({ ...spe, payload: { ...spe.payload, course } });
  }

  renderRequestIcon = () =>
    <div className="container">
      <div style={{ height: 130, background: 'rgba(239, 239, 239, 0.62)' }}/>
    </div>

  render = () =>
    <Loading spe={this.props.speGetCourse} requestIcon={this.renderRequestIcon()}>{(courseDto) =>
      <section className={css.actions}>
        {
          this.props.ifBreadcrumbsAreDisplayed &&
          <Breadcrumbs courseCategoryId={courseDto.course.courseCategoryId || false}/>
        }

        {
          this.props.ifConfused &&
          <article className="contact-us">
            Confused? Missing any features? <Link to="/contact">Contact us</Link>.
          </article>
        }

        <div className="container">
          <section className="title-and-buttons">

            <section className="course-title-and-edit-form">
              <h3 className="title">
                <Link to={url.courseEditOrShow(this.props.currentUser, courseDto.course)}>
                  {courseDto.course.title}
                </Link>
              </h3>

              {
                this.props.ifEditCourseModalTogglerIsDisplayed &&
                this.props.currentUser &&
                <CourseModal
                  toggler={
                    <button className="edit-button" type="button">
                      <i className="fa fa-hand-pointer-o"/> EDIT
                    </button>
                  }
                  course={courseDto.course}
                  uiUpdateCourse={this.uiUpdateCourse}
                />
              }
            </section>

            {
              this.props.currentUser ?
                <div className="buttons">
                  {
                    this.props.ifCuilActivityButtonsAreDisplayed &&
                    <CuilActivityButtons speCourseUserIsLearning={this.props.speCourseUserIsLearning} courseId={courseDto.course.id}/>
                  }

                  <LearnAndReviewButtons
                    courseUserIsLearning={this.props.speCourseUserIsLearning.payload}
                    amountOfProblems={this.props.amountOfProblems}
                  />
                </div> :
                <div className="please-sign-in_and_simulated-review-button">
                  <h4 className="please-sign-in">Sign in to start recording results</h4>

                  <Link
                    to={`/courses/${this.props.courseId}/review/simulated`}
                    className="simulated-review-button"
                  >REVIEW ({courseDto.amountOfProblems})</Link>
                </div>
            }
          </section>

          {
            this.props.ifCourseDescriptionIsDisplayed &&
            <CourseDescriptionAndStats course={courseDto.course} stats={courseDto.stats} nextDueDateIn={courseDto.nextDueDateIn} amountOfProblemsToReview={courseDto.amountOfProblemsToReview} courseUserIsLearning={courseDto.courseUserIsLearning}/>
          }
        </div>

        <MetaTags title={courseDto.course.title} description={courseDto.course.description}/>
      </section>
    }</Loading>
}

export { CourseActions };
