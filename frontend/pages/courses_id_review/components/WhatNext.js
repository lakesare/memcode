import { Loading } from '~/components/Loading';
import { ListOfCourses } from '~/components/ListOfCourses';

import * as CourseApi from '~/api/Course';

class WhatNext extends React.Component {
  static propTypes = {
    courseId: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);
    this.state = { speGetCourses: {} };
  }

  componentDidMount() {
    CourseApi.selectAllLearned(
      (spe) => {
        // for fast UI. last problem we reviews has probably not reached server yet.
        if (spe.status === 'success') {
          const datasWithoutJustReviewedOne = spe.payload.filter((data) => data.course.id !== this.props.courseId);
          const modifiedSpe = { ...spe, payload: datasWithoutJustReviewedOne };
          this.setState({ speGetCourses: modifiedSpe });
        } else {
          this.setState({ speGetCourses: spe });
        }
      }
    );
  }

  render = () =>
    <article className="what-next">
      <div className="space"/>
      <section className="congratulations">
        <h2>You successfully reviewed this course!</h2>
        <h3>What's next?</h3>
      </section>

      <section className="offered-courses">
        <Loading spe={this.state.speGetCourses}>{(coursesData) =>
          <ListOfCourses coursesData={coursesData.slice(0, 4)}/>
        }</Loading>
      </section>
    </article>
}

export { WhatNext };
