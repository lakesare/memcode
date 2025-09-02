import Urls from '~/services/Urls';
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

import css from './index.scss';

class CourseActions extends React.Component {
  static propTypes = {
    courseId: PropTypes.number.isRequired,
    currentUser: orFalse(PropTypes.object).isRequired,
    type: PropTypes.oneOf(['editOrShow', 'review', 'learn']),

    My: PropTypes.object.isRequired,
    MyActions: PropTypes.object.isRequired,
    currentProblem: PropTypes.object,
    onProblemsImported: PropTypes.func
  }

  apiStartLearning = () =>
    api.CourseUserIsLearningApi.startLearningCourse(
      false,
      { courseId: this.props.courseId }
    )
      .then((courseUserIsLearning) => {
        this.props.MyActions.startLearningCourse(courseUserIsLearning, this.props.currentUser);
        this.props.MyActions.apiGetCourses();
      })

  apiStopLearning = () =>
    api.CourseUserIsLearningApi.stopLearningCourse(
      false,
      { courseId: this.props.courseId }
    )
      .then((courseUserIsLearning) => {
        this.props.MyActions.stopLearningCourse(courseUserIsLearning, this.props.currentUser);
      })

  apiResumeLearning = () =>
    api.CourseUserIsLearningApi.resumeLearningCourse(
      false,
      { courseId: this.props.courseId }
    )
      .then((courseUserIsLearning) => {
        this.props.MyActions.resumeLearningCourse(courseUserIsLearning, this.props.currentUser);
        this.props.MyActions.apiGetCourses();
      })

  uiUpdateCourse = (course) => {
    const spe = this.props.My.speCourseForActions;
    this.props.MyActions.setSpeCourseForActions({ ...spe, payload: { ...spe.payload, course } });
  }

  // renderPlaceholder = () => (
  //   this.props.type === 'editOrShow' ?
  //     <div>
  //       <div style={{ height: 75, background: 'rgb(7, 9, 39)' }}/>
  //       <div style={{ height: 120, background: 'rgb(14, 16, 49)' }}/>
  //     </div> :
  //     null
  // )

  renderPlaceholder = () => {
    const dto = this.props.My.courses.find((someDto) => someDto.course.id === this.props.courseId);
//     const nOfProblemsToLearn = dto && dto.problems.filter(MyModel.isProblemToLearn).length;
//     const nOfProblemsToReview = dto && dto.problems.filter(MyModel.isProblemToReview).length;
// 
//     console.log(dto);


    return <section className={`course-actions ${css.actions}`}>
      <section className="title-and-buttons">
        <div className="container">
          <section className="course-title_and_category_and_author">
            <h1 className="title">
              {
                dto ?
                  <Link to={`/courses/${dto.course.id}`}>
                    {dto.course.title}
                  </Link> :
                  ''
              }
            </h1>
          </section>

          <div className="buttons"/>

          {
//             dto &&
//             <CuilButtons
//               nOfProblemsToLearn={nOfProblemsToLearn}
//               nOfProblemsToReview={nOfProblemsToReview}
//               currentUser={this.props.currentUser}
//               courseDto={dto}
// 
//               apiStartLearning={this.apiStartLearning}
//               apiStopLearning={this.apiStopLearning}
//               apiResumeLearning={this.apiResumeLearning}
//               MyActions={this.props.MyActions}
//               My={this.props.My}
//               type={this.props.type}
//             />
          }
        </div>
      </section>

      {
        // this.props.type === 'editOrShow' &&
        // <CourseDescriptionAndStats
        //   currentUser={this.props.currentUser}
        //   courseDto={courseDto}
        //   ifWithDescriptionPlaceholder={this.canIEditCourse()}
        //   My={this.props.My}
        // />
      }
    </section>;
  }

  canIEditCourse = () => {
    const currentUser = this.props.currentUser;
    const spe = this.props.My.speCourseForActions;
    if (spe.status !== 'success') return false;
    const { coauthors, course } = spe.payload;
    return Roles.canIEditCourse({ currentUser, coauthors, course });
  }

  renderTitleAndButtons = (courseDto) => {
    const dto = this.props.My.courses.find((someDto) => someDto.course.id === this.props.courseId);
    const nOfProblemsToLearn = (dto && dto.problems.filter(MyModel.isProblemToLearn).length) || 0;
    const nOfProblemsToReview = (dto && dto.problems.filter(MyModel.isProblemToReview).length) || 0;

    return <section className="title-and-buttons">
      <div className="container">
        <section className="course-title_and_category_and_author">
          <h1 className="title">
            <Link to={Urls.courseShow(courseDto.course.id)}>
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
            (
              this.props.type === 'editOrShow' ||
              this.props.type === 'learn'
            ) &&
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
                MyActions={this.props.MyActions}
                onProblemsImported={this.props.onProblemsImported}
              />

              <InviteCoauthorModal
                course={courseDto.course}
                author={courseDto.author}
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
              tooltipEl={"Only you and coauthors of this course can access this course."}
              tooltipProps={{ placement: 'bottom' }}
            >
              <div className="course-label -private">PRIVATE</div>
            </StandardTooltip>
          }

          {
            this.props.type === 'editOrShow' &&
            courseDto.course.duplicatedFromCourseId &&
            <StandardTooltip
              tooltipEl={<>This course was duplicated, see the <Link style={{ color: 'rgb(120, 175, 244)' }} to={`/courses/${courseDto.course.duplicatedFromCourseId}`} target="_blank">original course</Link>.</>}
              tooltipProps={{ placement: 'bottom', interactive: true }}
            >
              <div className="course-label -duplicated">DUPLICATED</div>
            </StandardTooltip>
          }
        </section>

        <CuilButtons
          nOfProblemsToLearn={nOfProblemsToLearn}
          nOfProblemsToReview={nOfProblemsToReview}
          currentUser={this.props.currentUser}
          courseDto={courseDto}

          apiStartLearning={this.apiStartLearning}
          apiStopLearning={this.apiStopLearning}
          apiResumeLearning={this.apiResumeLearning}
          MyActions={this.props.MyActions}
          My={this.props.My}
          type={this.props.type}
          currentProblem={this.props.currentProblem}
          ignoreCurrentFlashcard={this.props.ignoreCurrentFlashcard}
        />
      </div>
    </section>;
  }

  render = () =>
    <Loading spe={this.props.My.speCourseForActions} placeholder={this.renderPlaceholder()}>{(courseDto) =>
      <section className={`course-actions ${css.actions}`}>
        {this.renderTitleAndButtons(courseDto)}

        {
          this.props.type === 'editOrShow' &&
          <CourseDescriptionAndStats
            currentUser={this.props.currentUser}
            courseDto={courseDto}
            ifWithDescriptionPlaceholder={this.canIEditCourse()}
            My={this.props.My}
          />
        }

        <MetaTags title={courseDto.course.title} description={courseDto.course.description}/>
      </section>
    }</Loading>
}

export { CourseActions };
export default CourseActions;
