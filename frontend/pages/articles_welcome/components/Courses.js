import api from '~/api';

import Loading from '~/components/Loading';
import CourseCardSimple from '~/appComponents/CourseCardSimple';

class Courses extends React.Component {
  state = {
    speCourses: {}
  }

  componentDidMount = () => {
    api.get.CourseApi.getBest4((spe) => this.setState({ speCourses: spe }), {});
  }

  render = () =>
    <Loading spe={this.state.speCourses}>{({ courses }) =>
      <div className="list-of-courses">
        {courses.map((course) =>
          <CourseCardSimple key={course.course.id} courseDto={course} ifShowSimulatedReviewButton/>
        )}
      </div>
    }</Loading>
}

export default Courses;
