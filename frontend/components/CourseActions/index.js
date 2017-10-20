import { orFalse } from '~/services/orFalse';

import { Loading } from '~/components/Loading';
import { CourseTitle } from './components/CourseTitle';
import { LearnAndReviewButtons } from './components/LearnAndReviewButtons';
import { CuilActivityButtons } from './components/CuilActivityButtons';
import { EditButton } from './components/EditButton';
import { MetaTags } from './components/MetaTags';

import css from './index.css';

import { commonFetch } from '~/api/commonFetch';

@connect(
  (state, ownProps) => ({
    currentUser: state.global.Authentication.currentUser,
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
    currentUser: PropTypes.object,
    amountOfProblems: orFalse(PropTypes.object).isRequired,

    speGetCourse: PropTypes.object.isRequired,
    speCourseUserIsLearning: PropTypes.object.isRequired,

    seedSpeGetCourse: PropTypes.func.isRequired,

    ifCuilActivityButtonsAreDisplayed: PropTypes.bool,
    ifCourseDescriptionIsDisplayed: PropTypes.bool
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
    <Loading spe={this.props.speGetCourse} requestIcon={null}>{({ course }) =>
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
                  amountOfProblems={this.props.amountOfProblems}
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

export { CourseActions };
