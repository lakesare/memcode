import api from '~/api';
import { Link } from 'react-router-dom';

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
      <>
        <div className="list-of-courses">
          {courses.map((course) =>
            <CourseCardSimple key={course.course.id} courseDto={course} ifShowSimulatedReviewButton/>
          )}
        </div>

        <div className="more-courses-link" style={{ textAlign: 'center', marginTop: '30px', fontSize: '16px' }}>
          <Link to="/courses" style={{ color: '#27d19e', textDecoration: 'none' }}>
            To see courses for other languages, go to our courses page →
          </Link>
        </div>
      </>
    }</Loading>
}

export default Courses;
