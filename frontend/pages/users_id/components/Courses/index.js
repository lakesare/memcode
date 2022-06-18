import MyModel from '~/models/MyModel';
import speCreator from '~/services/speCreator';

import Loading from '~/components/Loading';
import CourseCategories from '~/appComponents/CourseCategories';
import ListOfCourseCards from '~/appComponents/ListOfCourseCards';
// import { ForBeginners } from './components/ForBeginners';

import css from './index.css';

const getQuery = (location) =>
  new URLSearchParams(location.search);

const getCategoryId = (location) => {
  const categoryId = getQuery(location).get('categoryId');
  return categoryId ? parseInt(categoryId) : false;
};

@connect(
  (state) => ({
    My: state.global.My
  })
)
class Courses extends React.Component {
  static propTypes = {
    My: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    isCurrentUser: PropTypes.bool.isRequired,
    createdCourses: PropTypes.array.isRequired
  }

  filterCoursesForCategory = (courseDtos) => {
    const categoryId = getCategoryId(this.props.location);
    if (categoryId) {
      return courseDtos.filter((courseDto) =>
        courseDto.course.course_category_id === categoryId ||
        courseDto.course.courseCategoryId === categoryId
      );
    } else {
      return courseDtos;
    }
  }

  filterCourseCategories = (courseCategories, courseDtos) => {
    return courseCategories.map((courseCategory) => ({
      ...courseCategory,
      amountOfCourses: courseDtos.filter((dto) =>
        dto.course.course_category_id === courseCategory.id ||
        dto.course.courseCategoryId === courseCategory.id
      ).length
    }));
  }

  getCourseDtos = () => {
    const createdCourses = this.props.createdCourses
      .map((dto) => ({ ...dto, type: 'simple' }));
    if (this.props.isCurrentUser) {
      const myCourses = this.props.My.courses.map(MyModel.dtoToCourseCardProps)
        .map((dto) => ({ ...dto, type: 'learnReview' }));
      MyModel.sortByHowMuchToDo(myCourses);

      const additionalCourses = createdCourses
        .filter((dto) =>
          !myCourses.some((dto2) => dto2.course.id === dto.course.id)
        );

      return [...myCourses, ...additionalCourses];
    } else {
      return createdCourses;
    }
  }

  render = () => {
    const courseDtos = this.getCourseDtos();
    return <section className={css.main}>
      <Loading spe={this.props.My.speCategories}>{({ courseCategoryGroups, courseCategories }) =>
        <Loading spe={this.props.isCurrentUser ? this.props.My.speCourses : speCreator.success()}>{() =>
          <div className="container standard-navigation_and_courses">
            <div className="left">
              <CourseCategories
                selectedCourseCategoryId={getCategoryId(this.props.location)}
                courseCategoryGroups={courseCategoryGroups}
                courseCategories={this.filterCourseCategories(courseCategories, courseDtos)}
                ifShowAmountOfCoursesInCategory
              />
            </div>
            <div className="right">
              <ListOfCourseCards
                className="list-of-courses"
                courseDtos={this.filterCoursesForCategory(courseDtos)}
              />
            </div>
          </div>
        }</Loading>
      }</Loading>
    </section>;
  }
}

export default Courses;
