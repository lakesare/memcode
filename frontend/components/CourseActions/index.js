import orFalse from '~/services/orFalse';
import UrlCreator from '~/services/UrlCreator';
import { IdsOfProblemsToLearnAndReviewPerCourseActions } from '~/reducers/IdsOfProblemsToLearnAndReviewPerCourse';
import api from '~/api';

import { Link } from 'react-router-dom';
import StandardTooltip from '~/components/StandardTooltip';
import MetaTags        from './components/MetaTags';
import Loading         from '~/components/Loading';

import CourseModal from './components/CourseModal';
import CuilButtons from './components/CuilButtons';
import InviteCoauthorModal       from './components/InviteCoauthorModal';
import CourseDescriptionAndStats from './components/CourseDescriptionAndStats';

import css from './index.css';

@connect(
  (state, ownProps) => ({
    currentUser: state.global.Authentication.currentUser || false,
    speGetCourse: state.components.CourseActions.speGetCourse,
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
    }),
    IdsOfProblemsToLearnAndReviewPerCourseActions: {
      stopLearningCourse: (courseId) => IdsOfProblemsToLearnAndReviewPerCourseActions.stopLearningCourse(dispatch, courseId),
      apiSync: () => IdsOfProblemsToLearnAndReviewPerCourseActions.apiSync(dispatch)
    }
  })
)
class CourseActions extends React.Component {
  static propTypes = {
    courseId: PropTypes.string.isRequired,
    currentUser: orFalse(PropTypes.object).isRequired,
    amountOfProblems: orFalse(PropTypes.object).isRequired,

    speGetCourse: PropTypes.object.isRequired,
    seedSpeGetCourse: PropTypes.func.isRequired,
    IdsOfProblemsToLearnAndReviewPerCourseActions: PropTypes.object.isRequired,

    ifCourseDescriptionIsDisplayed: PropTypes.bool,
    ifEditCourseModalTogglerIsDisplayed: PropTypes.bool,
    ifBreadcrumbsAreDisplayed: PropTypes.bool,
    ifWithDescriptionPlaceholder: PropTypes.bool
  }

  static defaultProps = {
    currentUser: false,
    ifCourseDescriptionIsDisplayed: false,
    ifEditCourseModalTogglerIsDisplayed: false,
    ifBreadcrumbsAreDisplayed: false,
    ifWithDescriptionPlaceholder: false
  }

  componentDidMount = () =>
    this.apiGetCourseActions()

  componentDidUpdate = (prevProps) => {
    if (prevProps.courseId !== this.props.courseId) {
      this.apiGetCourseActions();
    }
  }

  apiGetCourseActions = () =>
    api.PageApi.getForCourseActions(
      (spe) => this.props.seedSpeGetCourse(spe),
      {
        courseId: this.props.courseId
      }
    )

  apiStartLearning = () =>
    api.CourseUserIsLearningApi.startLearningCourse(
      false,
      { courseId: this.props.courseId }
    )
      .then((payload) => {
        this.uiUpdateCuil(payload);
        this.props.IdsOfProblemsToLearnAndReviewPerCourseActions.apiSync();
      })

  apiStopLearning = () =>
    api.CourseUserIsLearningApi.stopLearningCourse(
      false,
      { courseId: this.props.courseId }
    )
      .then((payload) => {
        this.uiUpdateCuil(payload);
        this.props.IdsOfProblemsToLearnAndReviewPerCourseActions.stopLearningCourse(this.props.courseId);
      })

  apiResumeLearning = () =>
    api.CourseUserIsLearningApi.resumeLearningCourse(
      false,
      { courseId: this.props.courseId }
    )
      .then((payload) => {
        this.uiUpdateCuil(payload);
        this.props.IdsOfProblemsToLearnAndReviewPerCourseActions.apiSync();
      })

  uiUpdateCourse = (course) => {
    const spe = this.props.speGetCourse;
    this.props.seedSpeGetCourse({ ...spe, payload: { ...spe.payload, course } });
  }

  uiUpdateCuil = (courseUserIsLearning) => {
    const spe = this.props.speGetCourse;
    this.props.seedSpeGetCourse({ ...spe, payload: { ...spe.payload, courseUserIsLearning } });
  }

  renderRequestIcon = () => (
    this.props.ifCourseDescriptionIsDisplayed ?
      <div>
        <div style={{ height: 75, background: 'rgb(7, 9, 39)' }}/>
        <div style={{ height: 120, background: 'rgb(14, 16, 49)' }}/>
      </div> :
      null
  )

  renderTitleAndButtons = (courseDto) =>
    <section className="title-and-buttons">
      <div className="container">
        <section className="course-title_and_category_and_author">
          <h1 className="title">
            <Link to={UrlCreator.courseEditOrShow(this.props.currentUser, courseDto.course)}>
              {courseDto.course.title}
            </Link>
          </h1>

          {
            this.props.ifBreadcrumbsAreDisplayed &&
            <section className="category_and_author">
              <div className="category">
                <span className="in-or-by">In</span>
                <Link to={`/courses?categoryId=${courseDto.courseCategory.id}`}>
                  {courseDto.courseCategory.name}
                </Link>
              </div>

              <div className="author">
                <span className="in-or-by">By</span>
                <span>{courseDto.author.username}</span>
              </div>
            </section>
          }

          <div className="buttons">
            {
              this.props.ifEditCourseModalTogglerIsDisplayed &&
              this.props.currentUser &&
              <CourseModal
                toggler={
                  <button className="button edit-button" type="button">
                    <i className="fa fa-hand-pointer-o"/> EDIT
                  </button>
                }
                course={courseDto.course}
                uiUpdateCourse={this.uiUpdateCourse}
              />
            }

            {
              this.props.ifEditCourseModalTogglerIsDisplayed &&
              this.props.currentUser &&
              <InviteCoauthorModal
                course={courseDto.course}
                coauthors={courseDto.coauthors}
                currentUser={this.props.currentUser}
                toggler={
                  <button className="button invite-coauthor-button" type="button">
                    <i className="fa fa-users"/> INVITE COAUTHORS
                  </button>
                }
              />
            }
          </div>

          {
            this.props.ifEditCourseModalTogglerIsDisplayed &&
            !courseDto.course.ifPublic &&
            <StandardTooltip
              tooltipEl={"Your course isn't listed in /courses. Please consider making it public if you think someone else may want to study it."}
              tooltipProps={{ placement: 'bottom' }}
            >
              <div className="course-is-private-label">PRIVATE</div>
            </StandardTooltip>
          }
        </section>

        <CuilButtons
          amountOfProblems={this.props.amountOfProblems}
          currentUser={this.props.currentUser}
          courseDto={courseDto}

          apiStartLearning={this.apiStartLearning}
          apiStopLearning={this.apiStopLearning}
          apiResumeLearning={this.apiResumeLearning}
        />
      </div>
    </section>

  render = () =>
    <Loading spe={this.props.speGetCourse} requestIcon={this.renderRequestIcon()}>{(courseDto) =>
      <section className={`course-actions ${css.actions}`}>
        {this.renderTitleAndButtons(courseDto)}

        {
          this.props.ifCourseDescriptionIsDisplayed &&
          <CourseDescriptionAndStats
            currentUser={this.props.currentUser}
            course={courseDto.course}
            stats={courseDto.stats}
            nextDueDateIn={courseDto.nextDueDateIn}
            courseUserIsLearning={courseDto.courseUserIsLearning}
            ifWithDescriptionPlaceholder={this.props.ifWithDescriptionPlaceholder}
          />
        }

        <MetaTags title={courseDto.course.title} description={courseDto.course.description}/>
      </section>
    }</Loading>
}

export { CourseActions };
export default CourseActions;
