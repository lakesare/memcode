import CourseApi from '~/api/CourseApi';
import MyModel from '~/models/MyModel';

import { Helmet } from 'react-helmet';

import Main from '~/appComponents/Main';
import Loading from '~/components/Loading';
import SelectDropdown from '~/components/SelectDropdown';
import CourseCategories from '~/appComponents/CourseCategories';
import ListOfCourseCards from '~/appComponents/ListOfCourseCards';
import { ForBeginners } from './components/ForBeginners';

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
  })
)
class Page_courses_learning extends React.Component {
  static propTypes = {
    My: PropTypes.object.isRequired
  }

  state = {
    speGetCourses: {},
    tab: 'learning'
  }

  componentDidMount = () => {
    this.apiGetCreatedCourses();
  }

  apiGetCreatedCourses = () =>
    CourseApi.selectAllCreated(
      spe => this.setState({ speGetCreatedCourses: spe })
    )

  filterCoursesForCategory = (coursesData) => {
    const categoryId = getCategoryId(this.props);
    if (categoryId) {
      return coursesData.filter((courseData) =>
        courseData.course.course_category_id === categoryId
      );
    } else {
      return coursesData;
    }
  }

  filterCourseCategoriesForUser = (courseCategories) => {
    const coursesData = this.state.tab === 'learning' ?
      this.state.speGetCourses.payload :
      this.state.speGetCreatedCourses.payload;

    return courseCategories.map((courseCategory) => ({
      ...courseCategory,
      amountOfCourses: coursesData.filter((courseData) =>
        courseData.course.courseCategoryId === courseCategory.id
      ).length
    }));
  }

  renderFilter = () =>
    <SelectDropdown
      className="sort-by-dropdown-wrapper standard-dropdown-wrapper standard-input -Select"
      dropdownClassName="standard-dropdown -purple"
      value={this.state.tab}
      updateValue={(tab) => this.setState({ tab })}
      possibleValues={{
        learning: 'Learning',
        created: 'Created'
      }}
      renderLi={(value, humanValue) => humanValue}
    />

  getCourseDtos = () => {
    const courseDtosWithAmounts = this.props.My.courses.map((dto) => {
      const nextDueProblem = MyModel.getNextDueProblem(dto);
      const problemsToLearn = dto.problems.filter(MyModel.isProblemToLearn);
      const problemsToReview = dto.problems.filter(MyModel.isProblemToReview);

      return {
        ...dto,
        amountOfProblemsToLearn: problemsToLearn.length,
        amountOfProblemsToReview: problemsToReview.length,
        nextDueDate: nextDueProblem ? nextDueProblem.nextDueDate : null,
        nextDueDateIn: nextDueProblem ? nextDueProblem.nextDueDateIn : null
      };
    });

    MyModel.sortByHowMuchToDo(courseDtosWithAmounts);

    return courseDtosWithAmounts;
  }

  filterCourseCategoriesForUserLearning = (courseCategories) => {
    return courseCategories.map((courseCategory) => ({
      ...courseCategory,
      amountOfCourses: this.props.My.courses.filter((course) =>
        course.course.course_category_id === courseCategory.id
      ).length
    }));
  }

  renderLearningTab = (courseCategoryGroups, courseCategories) =>
    <Loading spe={this.props.My.speCourses}>{() =>
      this.props.My.courses.length === 0 ?
        <ForBeginners/> :
        <div className="container standard-navigation_and_courses">
          <CourseCategories
            selectedCourseCategoryId={getCategoryId(this.props)}
            courseCategoryGroups={courseCategoryGroups}
            courseCategories={this.filterCourseCategoriesForUserLearning(courseCategories)}
            ifShowAmountOfCoursesInCategory
          />
          <div className="title_and_sorting_and_courses">
            <div className="title_and_sorting">
              <h1 className="title">My Courses</h1>

              {this.renderFilter()}
            </div>

            <ListOfCourseCards
              className="list-of-courses"
              type="learnReview"
              courseDtos={this.filterCoursesForCategory(this.getCourseDtos())}
            />
          </div>
        </div>
    }</Loading>

  renderCreatedTab = (courseCategoryGroups, courseCategories) =>
    <Loading spe={this.state.speGetCreatedCourses}>{(coursesData) =>
      coursesData.length === 0 ?
        <ForBeginners/> :
        <div className="container standard-navigation_and_courses">
          <CourseCategories
            selectedCourseCategoryId={getCategoryId(this.props)}
            courseCategoryGroups={courseCategoryGroups}
            courseCategories={this.filterCourseCategoriesForUser(courseCategories)}
            ifShowAmountOfCoursesInCategory
          />
          <div className="title_and_sorting_and_courses">
            <div className="title_and_sorting">
              <h1 className="title">My Courses</h1>

              {this.renderFilter()}
            </div>

            <ListOfCourseCards
              className="list-of-courses"
              type="simple"
              courseDtos={this.filterCoursesForCategory(coursesData)}
            />
          </div>
        </div>
    }</Loading>

  render = () =>
    <Main className={css.main}>
      <Loading spe={this.props.My.speCategories}>{({ courseCategoryGroups, courseCategories }) =>
        this.state.tab === 'learning' ?
          this.renderLearningTab(courseCategoryGroups, courseCategories) :
          this.renderCreatedTab(courseCategoryGroups, courseCategories)
      }</Loading>

      <Helmet>
        <title>My Courses</title>
      </Helmet>
    </Main>
}

export default Page_courses_learning;
