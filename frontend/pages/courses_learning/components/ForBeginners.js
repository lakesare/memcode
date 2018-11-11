import * as CourseApi from '~/api/Course';

import { Link } from 'react-router';
import { Loading } from '~/components/Loading';
import { ListOfSimpleCourses } from '~/components/ListOfSimpleCourses';

class ForBeginners extends React.Component {
  state = {
    speGetCourses: {}
  }

  componentDidMount = () => {
    CourseApi.selectPublic(
      (spe) => this.setState({ speGetCourses: spe }),
      {
        pageSize: 10,
        pageNumber: 1,
        sortBy: 'popular'
      }
    );
  }

  render = () =>
    <section className="for-beginners">
      <article className="welcome">
        <h1 className="welcome-title">Welcome!</h1>
        <div className="description">
          <h2>You are not learning any courses yet.</h2>
          <p>You may look at the existing <Link to="/courses">courses</Link>, or <Link to="/courses/new">create your own course</Link>.</p>
        </div>
      </article>

      <hr/>

      <h2 className="meanwhile-here-are-popular-courses-title">Meanwhile, here are the most popular courses:</h2>
      <Loading spe={this.state.speGetCourses}>{({ onePageOfCourses }) =>
        <ListOfSimpleCourses coursesData={onePageOfCourses}/>
      }</Loading>
    </section>
}

export { ForBeginners };
