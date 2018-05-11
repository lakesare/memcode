import { Helmet } from 'react-helmet';

import { Header }  from '~/components/Header';
import { Footer } from '~/components/Footer';
import { Loading } from '~/components/Loading';
import { ListOfCourses } from '~/components/ListOfCourses';
import { ProfileNavigation } from '~/components/ProfileNavigation';
import { Link } from 'react-router';


import * as CourseApi from '~/api/Course';

class Page_courses_created extends React.Component {
  state = {
    speGetCourses: {}
  }

  componentDidMount = () => {
    CourseApi.selectAllCreated(
      spe => this.setState({ speGetCourses: spe }),
    );
  }

  renderForBeginners = () =>
    <article className="article-formatting" style={{ textAlign: 'center' }}>
      <h1>Welcome!</h1>
      <h2>You haven't created any courses yet.</h2>

      <p>
        You may look at the existing <Link to="/courses">courses</Link>, or <Link to="/courses/new">create your own course</Link>.
      </p>
    </article>

  render = () =>
    <main>
      <Header/>
      <ProfileNavigation/>
      <div className="container">
        <div className="space"/>
        <Loading spe={this.state.speGetCourses}>{(coursesData) => (
          coursesData.length === 0 ?
            this.renderForBeginners() :
            <ListOfCourses coursesData={coursesData}/>
        )}</Loading>
      </div>

      <Footer/>

      <Helmet>
        <title>Memcode | Created Courses</title>
      </Helmet>
    </main>
}

export { Page_courses_created };
