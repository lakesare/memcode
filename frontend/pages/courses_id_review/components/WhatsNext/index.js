import { orFalse } from '~/services/orFalse';
import * as createSpe from '~/services/spe';
import CourseApi from '~/api/CourseApi';
import humanizePostgresInterval from '~/services/humanizePostgresInterval';

import Loading from '~/components/Loading';
import CourseCardLearnReview from '~/appComponents/CourseCardLearnReview';
import CourseCardSimple from '~/appComponents/CourseCardSimple';

import css from './index.css';

class WhatsNext extends React.Component {
  static propTypes = {
    courseId: PropTypes.number.isRequired,
    currentUser: orFalse(PropTypes.object).isRequired,
    speNextReviewIn: PropTypes.object.isRequired,
    ifDisplay: PropTypes.bool.isRequired
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

      // um, 8 actually
      const amountOfCoursesToShow = 20;

      let finalCourses = filteredOwnCourses
        .slice(0, amountOfCoursesToShow)
        .map((courseData) => ({ ...courseData, _type: 'learnReviewCourse' }));

      if (finalCourses.length < amountOfCoursesToShow) {
        const filteredPopularCourses = popularCourses
          .onePageOfCourses
          .filter(({ course }) =>
            (course.id !== this.props.courseId) &&
            // ignore those courses which are already in filteredOwnCourses
            !filteredOwnCourses.find((ownCourseData) => ownCourseData.course.id === course.id)
          );
        const neededAmountOfCourses = amountOfCoursesToShow - finalCourses.length;

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
    CourseApi.selectPublic(
      false,
      {
        pageSize: 21,
        pageNumber: 1,
        sortBy: 'popular'
      }
    )

  render = () =>
    <section className={css.section} style={this.props.ifDisplay ? {} : { display: 'none' }}>
      <div className="space"/>
      <section className="congratulations">
        <h2>You successfully reviewed this course!</h2>

        {
          this.props.currentUser &&
          this.props.speNextReviewIn.status &&
          <div className="next-review-time">
            Next review:
            <Loading enabledStatuses={['success']} spe={this.props.speNextReviewIn}>{({ nextDueDateIn }) =>
              <span> in {humanizePostgresInterval(nextDueDateIn)}</span>
            }</Loading>
          </div>
        }

        <h3 className="whats-next">What's next?</h3>
      </section>

      <Loading spe={this.state.speCourses}>{(coursesData) => (
        <section className="offered-courses list-of-courses">
          {coursesData.map((courseData) => (
            courseData._type === 'simpleCourse' ?
              <CourseCardSimple key={courseData.course.id} courseDto={courseData}/> :
              <CourseCardLearnReview key={courseData.course.id} courseDto={courseData}/>
          ))}
        </section>
      )}</Loading>
    </section>
}

export default WhatsNext;
