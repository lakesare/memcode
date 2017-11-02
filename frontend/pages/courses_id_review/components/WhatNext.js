import { orFalse } from '~/services/orFalse';
import * as createSpe from '~/services/spe';
import { commonFetch } from '~/api/commonFetch';
import * as CourseApi from '~/api/Course';

import { Loading } from '~/components/Loading';
import { Course as LearnReviewCourse } from '~/components/ListOfCourses/components/Course';
import { Course as SimpleCourse } from '~/components/ListOfSimpleCourses/components/Course';

class WhatNext extends React.Component {
  static propTypes = {
    courseId: PropTypes.number.isRequired,
    currentUser: orFalse(PropTypes.object).isRequired
  }

  state = { speCourses: {} }

  componentDidMount() {
    this.apiGetCourses();
  }

  apiGetCourses = () => {
    this.setState({ speCourses: createSpe.request() });
    Promise.all([
      this.apiGetPopularCourses(),
      (this.props.currentUser ? this.apiGetOwnCourses() : [])
    ]).then(([popularCourses, ownCourses]) => {
      const filteredOwnCourses = ownCourses.filter(({ course }) => course.id !== this.props.courseId);

      let finalCourses = filteredOwnCourses
        .slice(0, 4)
        .map((courseData) => ({ ...courseData, _type: 'learnReviewCourse' }));

      if (finalCourses.length < 4) {
        const filteredPopularCourses = popularCourses
          .filter(({ course }) =>
            (course.id !== this.props.courseId) &&
            // ignore those courses which are already in filteredOwnCourses
            !filteredOwnCourses.find((ownCourseData) => ownCourseData.course.id === course.id)
          );
        const neededAmountOfCourses = 4 - finalCourses.length;
        finalCourses = [
          ...finalCourses,
          ...filteredPopularCourses
            .slice(0, neededAmountOfCourses)
            .map((courseData) => ({ ...courseData, _type: 'simpleCourse' }))
        ];
      }
      this.setState({ speCourses: createSpe.success(finalCourses) });
    }).catch((error) => {
      this.setState({ speCourses: createSpe.failure(error) });
    });
  }

  apiGetOwnCourses = () =>
    CourseApi.selectAllLearned(false)

  apiGetPopularCourses = () =>
    commonFetch(false, 'GET', '/api/pages/courses')

  render = () =>
    <article className="what-next">
      <div className="space"/>
      <section className="congratulations">
        <h2>You successfully reviewed this course!</h2>
        <h3>What's next?</h3>
      </section>

      <Loading spe={this.state.speCourses}>{(coursesData) => (
        <section className="offered-courses list-of-courses">
          {coursesData.map((courseData) => (
            courseData._type === 'simpleCourse' ?
              <SimpleCourse key={courseData.course.id} {...courseData}/> :
              <LearnReviewCourse key={courseData.course.id} {...courseData}/>
          ))}
        </section>
      )}</Loading>
    </article>
}

export { WhatNext };
