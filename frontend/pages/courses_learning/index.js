import CourseApi from '~/api/CourseApi';
import CourseCategoryApi from '~/api/CourseCategoryApi';

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
    speGetCategories: {},
    tab: 'learning'
  }

  componentDidMount = () => {
    this.apiGetCreatedCourses();
    this.apiGetCategories();
  }

  apiGetCategories = () =>
    CourseCategoryApi.selectWithGroups(
      (spe) => this.setState({ speGetCategories: spe })
    )

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
    const courseDtos = this.props.My.courses.map((course) => {
      let due = null;
      const problemsToReview = course.problems.filter((p) => {
        if (p._learned && Object.values(p.nextDueDateIn)[0] < 0 && !p.ifIgnored) {
          return true;
        } else {
          if (p._learned && p.nextDueDateIn) {
            if (!due) {
              due = p.nextDueDateIn;
            } else if (Object.values(due)[0] > Object.values(p.nextDueDateIn)[0]) {
              due = p.nextDueDateIn;
            }
          }
          return false;
        }
      });
      const problemsToLearn = course.problems.filter((p) =>
        !p._learned
      );

      return {
        ...course,
        amountOfProblemsToLearn: problemsToLearn.length,
        amountOfProblemsToReview: problemsToReview.length,
        nextDueDateIn: due
      };
    });

    courseDtos.sort((a, b) => {
      if (a.amountOfProblemsToReview > b.amountOfProblemsToReview) {
        return -1;
      } else if (a.amountOfProblemsToReview < b.amountOfProblemsToReview) {
        return 1;
      } else {
        if (a.amountOfProblemsToLearn > b.amountOfProblemsToLearn) {
          return -1;
        } else if (a.amountOfProblemsToLearn > b.amountOfProblemsToLearn) {
          return 1;
        } else {
          if (a.nextDueDateIn > b.nextDueDateIn) {
            return -1;
          } else {
            return 1;
          }
        }
      }
    });

    return courseDtos;
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

  render = () =>
    <Main className={css.main}>
      <Loading spe={this.state.speGetCategories}>{({ courseCategoryGroups, courseCategories }) =>
        this.state.tab === 'learning' ?
          this.renderLearningTab(courseCategoryGroups, courseCategories) :
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
      }</Loading>
    </Main>
}

export default Page_courses_learning;
