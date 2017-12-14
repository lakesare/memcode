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
    <section>
      <article className="article-formatting">
        <h1>Welcome!</h1>
        <h2>You are not learning any courses yet.</h2>

        <p>
          You may look at the existing <Link to="/courses">courses</Link>, or <Link to="/courses/new">create your own course</Link>.
        </p>

        <h3>Meanwhile, here are the most popular courses:</h3>
      </article>

      <Loading spe={this.state.speGetCourses}>{({ onePageOfCourses }) =>
        <ListOfSimpleCourses coursesData={onePageOfCourses}/>
      }</Loading>
    </section>
}

export { ForBeginners };
