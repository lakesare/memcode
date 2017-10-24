import { orFalse } from '~/services/orFalse';
import * as CourseApi from '~/api/Course';
import { commonFetch } from '~/api/commonFetch';

import { Loading } from '~/components/Loading';
import { ListOfCourses } from '~/components/ListOfCourses';
import { ListOfSimpleCourses } from '~/components/ListOfSimpleCourses';

class WhatNext extends React.Component {
  static propTypes = {
    courseId: PropTypes.number.isRequired,
    currentUser: orFalse(PropTypes.object).isRequired
  }

  state = { speGetCourses: {} }

  componentDidMount() {
    if (this.props.currentUser) {
      this.apiGetLearnedCourses();
    } else {
      this.apiGetPopularCourses();
    }
  }

  onSuccessFilterFromJustReviewedCourse = (spe) => {
    // for fast UI. last problem we reviews has probably not reached server yet.
    if (spe.status === 'success') {
      const datasWithoutJustReviewedOne = spe.payload.filter((data) => data.course.id !== this.props.courseId);
      const modifiedSpe = { ...spe, payload: datasWithoutJustReviewedOne };
      this.setState({ speGetCourses: modifiedSpe });
    } else {
      this.setState({ speGetCourses: spe });
    }
  }

  apiGetLearnedCourses = () =>
    CourseApi.selectAllLearned(
      (spe) => this.onSuccessFilterFromJustReviewedCourse(spe)
    )

  apiGetPopularCourses = () =>
    commonFetch((spe) => this.setState({ speGetCourses: spe }),
      'GET', '/api/pages/courses'
    )

  render = () =>
    <article className="what-next">
      <div className="space"/>
      <section className="congratulations">
        <h2>You successfully reviewed this course!</h2>
        <h3>What's next?</h3>
      </section>

      <section className="offered-courses">
        <Loading spe={this.state.speGetCourses}>{(coursesData) => (
          this.props.currentUser ?
            <ListOfCourses coursesData={coursesData.slice(0, 4)}/> :
            <ListOfSimpleCourses coursesData={coursesData.slice(0, 8)}/>
        )}</Loading>
      </section>
    </article>
}

export { WhatNext };
