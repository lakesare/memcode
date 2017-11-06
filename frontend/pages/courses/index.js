import { commonFetch } from '~/api/commonFetch';

import { Helmet } from 'react-helmet';
import { Header } from '~/components/Header';
import { Footer } from '~/components/Footer';
import { Loading } from '~/components/Loading';
import { SelectDropdown } from '~/components/SelectDropdown';
import { ListOfSimpleCourses } from '~/components/ListOfSimpleCourses';
import { ProfileNavigation } from '~/components/ProfileNavigation';

import css from './index.css';

class Page_courses extends React.Component {
  state = {
    speGetCourses: {},
    sortBy: 'popular'
  }

  componentDidMount = () =>
    this.apiGetCourses();

  apiGetCourses = () =>
    commonFetch(
      spe => this.setState({ speGetCourses: spe }),
      'GET', `/api/pages/courses?sortBy=${this.state.sortBy}`
    )

  updateSortBy = (sortBy) => {
    this.setState({ sortBy }, this.apiGetCourses);
  }

  render = () =>
    <main className={css.main}>
      <Header/>
      <ProfileNavigation/>

      <div className="container">
        <section className="sort-by">
          <label>Sort By:</label>

          <SelectDropdown
            className="select-dropdown standard-dropdown-wrapper"
            value={this.state.sortBy}
            updateValue={this.updateSortBy}
            possibleValues={{
              popular: 'Most popular',
              new: 'Recently created'
            }}
          />
        </section>

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
