import CourseApi from '~/api/CourseApi';

import { Link } from 'react-router-dom';
import Loading from '~/components/Loading';
import ListOfCourseCards from '~/appComponents/ListOfCourseCards';

class ForBeginners extends React.Component {
  state = {
    speGetCourses: {}
  }

  componentDidMount = () => {
    CourseApi.selectPublic(
      (spe) => this.setState({ speGetCourses: spe }),
      {
        pageSize: 16,
        pageNumber: 1,
        sortBy: 'popular'
      }
    );
  }

  render = () =>
    <section className="for-beginners">
      <div className="container">
        <article className="welcome">
          <h1 className="title">Welcome!</h1>
          <div className="description">
            <h2>You are not learning any courses yet.</h2>
            <p>
              You may look at the existing <Link to="/courses">courses</Link>, or <Link to="/courses/new">create your own course</Link>.
            </p>
            <p>
              Or just walk around the site, isn't it damn beautiful?
            </p>
          </div>
        </article>

        <hr/>

        <h2 className="meanwhile-here-are-popular-courses-title">Meanwhile, here are the most popular courses:</h2>
        <Loading spe={this.state.speGetCourses}>{({ onePageOfCourses }) =>
          <ListOfCourseCards type="simple" courseDtos={onePageOfCourses}/>
        }</Loading>
      </div>
    </section>
}

export { ForBeginners };
