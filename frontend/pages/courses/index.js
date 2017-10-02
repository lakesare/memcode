import { commonFetch } from '~/api/commonFetch';

import { Helmet } from 'react-helmet';
import { Header } from '~/components/Header';
import { Footer } from '~/components/Footer';
import { Loading } from '~/components/Loading';
import { ListOfSimpleCourses } from '~/components/ListOfSimpleCourses';
import { ProfileNavigation } from '~/components/ProfileNavigation';

import css from './index.css';

class Page_courses extends React.Component {
  state = {
    speGetCourses: {},
    searchString: ''
  }

  componentDidMount = () =>
    commonFetch(
      spe => this.setState({ speGetCourses: spe }),
      'GET', '/api/pages/courses'
    )

  render = () =>
    <main className={css.main}>
      <Header/>
      <ProfileNavigation/>

      <div className="space"/>

      <div className="container">
        <Loading spe={this.state.speGetCourses}>{(coursesData) =>
          <ListOfSimpleCourses coursesData={coursesData}/>
        }</Loading>
      </div>

      <Footer/>

      <Helmet>
        <title>Memcode | All courses</title>
        <meta name="description" content="Learn existing courses on programming, maths and physics, or create your own."/> :
      </Helmet>
    </main>
}

export { Page_courses };
