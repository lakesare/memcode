import { Helmet } from 'react-helmet';

import { Header }  from '~/components/Header';
import { Footer } from '~/components/Footer';
import { Loading } from '~/components/Loading';
import { ListOfCourses } from '~/components/ListOfCourses';
import { ProfileNavigation } from '~/components/ProfileNavigation';

import * as CourseApi from '~/api/Course';

class Page_profile_coursesCreatedByMe extends React.Component {
  state = {
    speGetCourses: {}
  }

  componentDidMount = () => {
    CourseApi.selectAllCreated(
      spe => this.setState({ speGetCourses: spe }),
    );
  }

  render = () =>
    <main>
      <Header/>
      <ProfileNavigation/>
      <div className="container">
        <div className="space"/>
        <Loading spe={this.state.speGetCourses}>{coursesData =>
          <ListOfCourses coursesData={coursesData}/>
        }</Loading>
      </div>

      <Footer/>

      <Helmet>
        <title>Profile | Created Courses</title>
      </Helmet>
    </main>
}

export { Page_profile_coursesCreatedByMe };
