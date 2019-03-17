import CourseApi from '~/api/CourseApi';
import CourseCategoryApi from '~/api/CourseCategoryApi';

import { Helmet } from 'react-helmet';

import { Header }  from '~/components/Header';
import { Footer } from '~/components/Footer';
import { Loading } from '~/components/Loading';
import CourseCategories from '~/appComponents/CourseCategories';
import { ListOfCourses } from '~/components/ListOfCourses';
import { ProfileNavigation } from '~/components/ProfileNavigation';
import { ForBeginners } from './components/ForBeginners';

import MyDuck from '~/ducks/MyDuck';

import css from './index.css';

const getCategoryId = (props) => {
  const categoryId = getQuery(props).get('categoryId');
  return categoryId ? parseInt(categoryId) : false;
};

const getQuery = (props) =>
  new URLSearchParams(props.location.search);

@connect(
  (state) => ({
    My: state.global.My
  }),
  (dispatch) => ({
    apiGetMyEverything: () => MyDuck.actions.apiGet(dispatch)
  })
)
class Page_courses_learning extends React.Component {
  static propTypes = {
    My: PropTypes.object.isRequired,
    apiGetMyEverything: PropTypes.func.isRequired
  }

  state = {
    speGetCategories: {}
  }

  componentDidMount = () => {
    if (this.props.My.apiStatus !== 'success') {
      this.props.apiGetMyEverything();
    }
    this.apiGetCategories();
  }

  apiGetCategories = () =>
    CourseCategoryApi.selectWithGroups(
      (spe) => this.setState({ speGetCategories: spe })
    )

  filterCoursesForCategory = (coursesData) => {
    const categoryId = getCategoryId(this.props);
    if (categoryId) {
      return coursesData.filter((courseData) =>
        courseData.course.courseCategoryId === categoryId
      );
    } else {
      return coursesData;
    }
  }

  filterCourseCategoriesForUser = (courseCategories) => {
    const coursesData = this.state.speGetCourses.payload;

    return courseCategories.map((courseCategory) => ({
      ...courseCategory,
      amountOfCourses: coursesData.filter((courseData) =>
        courseData.course.courseCategoryId === courseCategory.id
      ).length
    }));
  }

  renderCourse = (course) => {
    // MyDuck.selectors.getCourseUserIsLearning(state);
    // const courseUserIsLearning = this.props.My.coursesUserIsLearning.find((cuil) => cuil.courseId === course.id);
    // const problems = this.props.My.problems.find((problem) => problem.courseId === course.id);
    // const problemsUserIsLearning = this.props.My.problemsUserIsLearning.find((puil) => puil.courseUserIsLearningId);

    // 1.5s -> 2.6s
    // console.log();

    // <ReviewAndLearn
    //   courseId={course.id}
    //   amountOfProblemsToReview={this.props.amountOfProblemsToReview}
    //   amountOfProblemsToLearn={this.props.amountOfProblemsToLearn}
    //   nextDueDateIn={this.props.nextDueDateIn}
    // />

    // without frontend .find's:
    // 2652ms for scripting.
    // with frontend .find's:
    // 2922ms for scripting.

    // backend with problems:
    // 2.31s.
    // backend without problems:
    // 0.25s.

    // 1471ms frontend scripting when we don't send problems, hm into backend response, hm.

    return <div className="course -learnReviewCourse" key={course.id}>
      <section className="main">
        <h3 className="title">{course.title}</h3>

        <article
          className="description"
          dangerouslySetInnerHTML={{
            __html: course.description
          }}
        />

      </section>

      <section className="total-amount-of-mems">
        {this.props.amountOfProblems} flashcards
      </section>
    </div>
  }

  render = () =>
    <main className={css.main}>
      <Header/>
      <ProfileNavigation/>
      <div className="container">
        <div className="space"/>

    
        <div className="courses-and-nav">
          <Loading enabledStatuses={['failure', 'success']} spe={this.state.speGetCategories}>{({ courseCategoryGroups, courseCategories }) =>
            <CourseCategories
              courseCategoryId={getCategoryId(this.props)}
              courseCategoryGroups={courseCategoryGroups}
              // this.filterCourseCategoriesForUser(courseCategories)
              courseCategories={[]}
            />
          }</Loading>
          
          <div className="list-of-courses">{
            this.props.My.courses.map(this.renderCourse)
          }</div>
        </div>
      </div>

      <Footer/>

      <Helmet>
        <title>Memcode | Learned Courses</title>
      </Helmet>
    </main>
}

export default Page_courses_learning;
