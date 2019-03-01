import CourseApi from '~/api/CourseApi';

import { Helmet } from 'react-helmet';

import { Header }  from '~/components/Header';
import { Footer } from '~/components/Footer';
import { Loading } from '~/components/Loading';
import { ListOfCourses } from '~/components/ListOfCourses';
import { ProfileNavigation } from '~/components/ProfileNavigation';
import { Link } from 'react-router';

import css from './index.css';

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
    <article className="for-beginners welcome">
      <h1 className="welcome-title">Welcome!</h1>
      <div className="description">
        <h2>You haven't created any courses yet.</h2>
        <p>You may look at the existing <Link to="/courses">courses</Link>, or <Link to="/courses/new">create your own course</Link>.</p>
      </div>
    </article>

  render = () =>
    <main className={css.main}>
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

export default Page_courses_created;
