import { orFalse } from '~/services/orFalse';
import { commonFetch } from '~/api/commonFetch';

import { Loading } from '~/components/Loading';
import { CourseTitleAndEditForm } from './components/CourseTitleAndEditForm';
import { LearnAndReviewButtons } from './components/LearnAndReviewButtons';
import { CuilActivityButtons } from './components/CuilActivityButtons';
import { MetaTags } from './components/MetaTags';
import { Link } from 'react-router';

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
    ifEditCourseModalTogglerIsDisplayed: PropTypes.bool
  }

  static defaultProps = {
    currentUser: false,
    ifCuilActivityButtonsAreDisplayed: true,
    ifCourseDescriptionIsDisplayed: false,
    ifEditCourseModalTogglerIsDisplayed: false
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

  uiUpdateCourse = (course) => {
    const spe = this.props.speGetCourse;
    this.props.seedSpeGetCourse({ ...spe, payload: { ...spe.payload, course } });
  }

  render = () =>
    <Loading spe={this.props.speGetCourse} requestIcon={null}>{({ course, amountOfProblems }) =>
      <section className={css.actions}>
        <section className="title-and-buttons">
          <CourseTitleAndEditForm
            course={course}
            uiUpdateCourse={this.uiUpdateCourse}
            currentUser={this.props.currentUser}
            ifEditCourseModalTogglerIsDisplayed={this.props.ifEditCourseModalTogglerIsDisplayed}
          />

          {
            this.props.currentUser ?
              <div className="buttons">
                {
                  this.props.ifCuilActivityButtonsAreDisplayed &&
                  <CuilActivityButtons speCourseUserIsLearning={this.props.speCourseUserIsLearning} courseId={course.id}/>
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
                >REVIEW ({amountOfProblems})</Link>
              </div>
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

export { CourseActions };
