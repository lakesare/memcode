import { Link } from 'react-router';
import { Loading } from '~/components/Loading';
import { ListOfSimpleCourses } from '~/components/ListOfSimpleCourses';

import { commonFetch } from '~/api/commonFetch';

class ForBeginners extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speGetCourses: {}
    };
  }

  componentDidMount = () => {
    commonFetch(
      spe => this.setState({ speGetCourses: spe }),
      'GET', '/api/pages/courses'
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

      <Loading spe={this.state.speGetCourses}>{(coursesData) =>
        <ListOfSimpleCourses coursesData={coursesData.slice(0, 8)}/>
      }</Loading>
    </section>
}

export { ForBeginners };
