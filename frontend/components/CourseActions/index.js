import UrlCreator from '~/services/UrlCreator';
import orFalse from '~/services/orFalse';
import Roles from '~/services/Roles';
import api from '~/api';

import { Link }        from 'react-router-dom';
import StandardTooltip from '~/components/StandardTooltip';
import MetaTags        from './components/MetaTags';
import Loading         from '~/components/Loading';

import CourseModal from './components/CourseModal';
import CuilButtons from './components/CuilButtons';
import InviteCoauthorModal       from './components/InviteCoauthorModal';
import CourseDescriptionAndStats from './components/CourseDescriptionAndStats';

import css from './index.css';

class CourseActions extends React.Component {
  static propTypes = {
    courseId: PropTypes.string.isRequired,
    currentUser: orFalse(PropTypes.object).isRequired,
    idsOfProblemsToLearnAndReviewPerCourse: orFalse(PropTypes.object).isRequired,

    speCourseForActions: PropTypes.object.isRequired,
    setSpeCourseForActions: PropTypes.func.isRequired,
    IdsOfProblemsToLearnAndReviewPerCourseActions: PropTypes.object.isRequired,

    type: PropTypes.oneOf(['editOrShow', 'review', 'learn']),
  }

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
    const spe = this.props.speCourseForActions;
    this.props.setSpeCourseForActions({ ...spe, payload: { ...spe.payload, course } });
  }

  uiUpdateCuil = (courseUserIsLearning) => {
    const spe = this.props.speCourseForActions;
    this.props.setSpeCourseForActions({ ...spe, payload: { ...spe.payload, courseUserIsLearning } });
  }

  renderRequestIcon = () => (
    this.props.type === 'editOrShow' ?
      <div>
        <div style={{ height: 75, background: 'rgb(7, 9, 39)' }}/>
        <div style={{ height: 120, background: 'rgb(14, 16, 49)' }}/>
      </div> :
      null
  )

  canIEditCourse = () => {
    const currentUser = this.props.currentUser;
    const spe = this.props.speCourseForActions;
    if (spe.status !== 'success') return false;
    const { coauthors, course } = spe.payload;
    return Roles.canIEditCourse({ currentUser, coauthors, course });
  }

  renderTitleAndButtons = (courseDto) => {
    const ids = this.props.idsOfProblemsToLearnAndReviewPerCourse;
    const amountOfProblems = (ids && ids[this.props.courseId]) ?
      {
        toLearn: ids[this.props.courseId].toLearn.length,
        toReview: ids[this.props.courseId].toReview.length
      } :
      false;

    return <section className="title-and-buttons">
      <div className="container">
        <section className="course-title_and_category_and_author">
          <h1 className="title">
            <Link to={UrlCreator.courseEditOrShow(this.props.currentUser, courseDto.course)}>
              {courseDto.course.title}
            </Link>
          </h1>

          {
            (
              this.props.type === 'editOrShow' ||
              this.props.type === 'learn'
            ) &&
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
              this.props.type === 'editOrShow' &&
              this.canIEditCourse() &&
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
              this.props.type === 'editOrShow' &&
              this.canIEditCourse() &&
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
            this.props.type === 'editOrShow' &&
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
          amountOfProblems={amountOfProblems}
          currentUser={this.props.currentUser}
          courseDto={courseDto}

          apiStartLearning={this.apiStartLearning}
          apiStopLearning={this.apiStopLearning}
          apiResumeLearning={this.apiResumeLearning}
        />
      </div>
    </section>;
  }

  render = () =>
    <Loading spe={this.props.speCourseForActions} requestIcon={this.renderRequestIcon()}>{(courseDto) =>
      <section className={`course-actions ${css.actions}`}>
        {this.renderTitleAndButtons(courseDto)}

        {
          this.props.type === 'editOrShow' &&
          <CourseDescriptionAndStats
            currentUser={this.props.currentUser}
            course={courseDto.course}
            stats={courseDto.stats}
            nextDueDateIn={courseDto.nextDueDateIn}
            courseUserIsLearning={courseDto.courseUserIsLearning}
            ifWithDescriptionPlaceholder={this.canIEditCourse()}
          />
        }

        <MetaTags title={courseDto.course.title} description={courseDto.course.description}/>
      </section>
    }</Loading>
}

export { CourseActions };
export default CourseActions;
