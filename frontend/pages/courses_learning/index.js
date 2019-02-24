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

import css from './index.css';

const getCategoryId = (props) => {
  const categoryId = props.location.query.categoryId;
  return categoryId ? parseInt(categoryId) : false;
};

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
      <ProfileNavigation/>
      <div className="container">
        <div className="space"/>

        <Loading spe={this.state.speGetCourses}>{(coursesData) =>
          coursesData.length === 0 ?
            <ForBeginners/> :
            <div className="courses-and-nav">
              <Loading enabledStatuses={['failure', 'success']} spe={this.state.speGetCategories}>{({ courseCategoryGroups, courseCategories }) =>
                <CourseCategories
                  courseCategoryId={getCategoryId(this.props)}
                  courseCategoryGroups={courseCategoryGroups}
                  courseCategories={this.filterCourseCategoriesForUser(courseCategories)}
                />
              }</Loading>
              <ListOfCourses coursesData={this.filterCoursesForCategory(coursesData)}/>
            </div>
          }</Loading>
      </div>

      <Footer/>

      <Helmet>
        <title>Memcode | Learned Courses</title>
      </Helmet>
    </main>
}

export { Page_courses_learning };
