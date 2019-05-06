import CourseApi from '~/api/CourseApi';
import CourseCategoryApi from '~/api/CourseCategoryApi';

import { Helmet } from 'react-helmet';

import Header  from '~/components/Header';
import Footer from '~/components/Footer';
import Loading from '~/components/Loading';
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

class Page_courses_learning extends React.Component {
  state = {
    speGetCourses: {},
    speGetCategories: {}
  }

  componentDidMount = () => {
    this.apiGetCourses();
    this.apiGetCategories();
  }

  apiGetCategories = () =>
    CourseCategoryApi.selectWithGroups(
      (spe) => this.setState({ speGetCategories: spe })
    )

  apiGetCourses = () =>
    CourseApi.selectAllLearned(
      spe => this.setState({ speGetCourses: spe })
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

  render = () =>
    <main className={css.main}>
      <Header/>

      <Loading spe={this.state.speGetCategories}>{({ courseCategoryGroups, courseCategories }) =>
        <Loading spe={this.state.speGetCourses}>{(coursesData) =>
          coursesData.length === 0 ?
            <ForBeginners/> :
            <div className="container">
              <CourseCategories
                selectedCourseCategoryId={getCategoryId(this.props)}
                courseCategoryGroups={courseCategoryGroups}
                courseCategories={this.filterCourseCategoriesForUser(courseCategories)}
                ifShowAmountOfCoursesInCategory
              />
              <div className="title_and_sorting_and_courses">
                <ListOfCourseCards
                  className="list-of-courses"
                  type="learnReview"
                  courseDtos={this.filterCoursesForCategory(coursesData)}
                />
              </div>
            </div>
        }</Loading>
      }</Loading>

      <Footer/>

      <Helmet>
        <title>Memcode | Learned Courses</title>
      </Helmet>
    </main>
}

export default Page_courses_learning;
