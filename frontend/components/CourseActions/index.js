import { orFalse } from '~/services/orFalse';
import { commonFetch } from '~/api/commonFetch';

import { MetaTags } from './components/MetaTags';
import { Link } from 'react-router';
import { Loading } from '~/components/Loading';
import Breadcrumbs from './components/Breadcrumbs';
import { CourseTitleAndEditForm } from './components/CourseTitleAndEditForm';
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
    ifBreadcrumbsAreDisplayed: PropTypes.bool
  }

  static defaultProps = {
    currentUser: false,
    ifCuilActivityButtonsAreDisplayed: true,
    ifCourseDescriptionIsDisplayed: false,
    ifEditCourseModalTogglerIsDisplayed: false,
    ifBreadcrumbsAreDisplayed: false
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

  render = () =>
    <Loading spe={this.props.speGetCourse} requestIcon={null}>{(courseDto) =>
      <section className={css.actions}>
        {
          this.props.ifBreadcrumbsAreDisplayed &&
          <Breadcrumbs courseCategoryId={courseDto.course.courseCategoryId || false}/>
        }

        <div className="container">
          <section className="title-and-buttons">
            <CourseTitleAndEditForm
              course={courseDto.course}
              uiUpdateCourse={this.uiUpdateCourse}
              currentUser={this.props.currentUser}
              ifEditCourseModalTogglerIsDisplayed={this.props.ifEditCourseModalTogglerIsDisplayed}
            />

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
            <CourseDescriptionAndStats course={courseDto.course} stats={courseDto.stats}/>
          }
        </div>

        <MetaTags title={courseDto.course.title} description={courseDto.course.description}/>
      </section>
    }</Loading>
}

export { CourseActions };
