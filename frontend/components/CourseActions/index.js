import UrlCreator from '~/services/UrlCreator';
import orFalse from '~/services/orFalse';
import api from '~/api';
import Roles from '~/services/Roles';
import MyModel from '~/models/MyModel';

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
    courseId: PropTypes.number.isRequired,
    currentUser: orFalse(PropTypes.object).isRequired,
    type: PropTypes.oneOf(['editOrShow', 'review', 'learn']),

    My: PropTypes.object.isRequired,
    MyActions: PropTypes.object.isRequired,
  }

  apiStartLearning = () =>
    api.CourseUserIsLearningApi.startLearningCourse(
      false,
      { courseId: this.props.courseId }
    )
      .then((payload) => {
        this.uiUpdateCuil(payload);
        this.props.MyActions.apiGetCourses();
      })

  apiStopLearning = () =>
    api.CourseUserIsLearningApi.stopLearningCourse(
      false,
      { courseId: this.props.courseId }
    )
      .then((payload) => {
        this.uiUpdateCuil(payload);
        this.props.MyActions.stopLearningCourse(this.props.courseId);
      })

  apiResumeLearning = () =>
    api.CourseUserIsLearningApi.resumeLearningCourse(
      false,
      { courseId: this.props.courseId }
    )
      .then((payload) => {
        this.uiUpdateCuil(payload);
        this.props.MyActions.apiGetCourses();
      })

  uiUpdateCourse = (course) => {
    const spe = this.props.My.speCourseForActions;
    this.props.MyActions.setSpeCourseForActions({ ...spe, payload: { ...spe.payload, course } });
  }

  uiUpdateCuil = (courseUserIsLearning) => {
    const spe = this.props.My.speCourseForActions;
    this.props.MyActions.setSpeCourseForActions({ ...spe, payload: { ...spe.payload, courseUserIsLearning } });
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
    const spe = this.props.My.speCourseForActions;
    if (spe.status !== 'success') return false;
    const { coauthors, course } = spe.payload;
    return Roles.canIEditCourse({ currentUser, coauthors, course });
  }

  renderTitleAndButtons = (courseDto) => {
    const dto = this.props.My.courses.find((someDto) => someDto.course.id === this.props.courseId);
    const amountOfProblems = dto ?
      {
        toLearn: dto.problems.filter(MyModel.isProblemToLearn).length,
        toReview: dto.problems.filter(MyModel.isProblemToReview).length
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
                <Link to={`/users/${courseDto.author.id}`}>
                  {courseDto.author.username}
                </Link>
              </div>
            </section>
          }

          {
            this.props.type === 'editOrShow' &&
            this.canIEditCourse() &&
            <section className="edit-invite-buttons">
              <CourseModal
                toggler={
                  <button className="button edit-button" type="button">
                    <i className="fa fa-hand-pointer-o"/> EDIT
                  </button>
                }
                course={courseDto.course}
                uiUpdateCourse={this.uiUpdateCourse}
              />

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
            </section>
          }

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
    <Loading spe={this.props.My.speCourseForActions} requestIcon={this.renderRequestIcon()}>{(courseDto) =>
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
