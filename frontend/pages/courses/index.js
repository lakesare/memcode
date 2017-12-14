import * as CourseApi from '~/api/Course';

import { Helmet } from 'react-helmet';
import { Header } from '~/components/Header';
import { Footer } from '~/components/Footer';
import { Loading } from '~/components/Loading';
import Pagination from '~/components/Pagination';
import { SelectDropdown } from '~/components/SelectDropdown';
import { ListOfSimpleCourses } from '~/components/ListOfSimpleCourses';
import { ProfileNavigation } from '~/components/ProfileNavigation';

import css from './index.css';

class Page_courses extends React.Component {
  state = {
    speGetCourses: {},
    sortBy: 'popular',
    currentPage: 1,
    // to avoid blinking pagination
    amountOfPages: 1
  }

  componentDidMount = () =>
    this.apiGetCourses();

  apiGetCourses = () =>
    CourseApi.selectPublic(
      (spe) => this.setState({ speGetCourses: spe }),
      {
        pageSize: 15,
        pageNumber: this.state.currentPage,
        sortBy: this.state.sortBy
      }
    )
      .then(({ amountOfPages }) =>
        this.setState({ amountOfPages })
      )

  updateSortBy = (sortBy) =>
    this.setState({ sortBy, currentPage: 1 }, this.apiGetCourses)

  updateCurrentPage = (currentPage) =>
    this.setState({ currentPage }, this.apiGetCourses)

  render = () =>
    <main className={css.main}>
      <Header/>
      <ProfileNavigation/>

      <div className="container">
        <div className="sorting-options">
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

          <Pagination amountOfPages={this.state.amountOfPages} currentPage={this.state.currentPage} updateCurrentPage={this.updateCurrentPage}/>
        </div>

        <Loading spe={this.state.speGetCourses}>{({ onePageOfCourses }) =>
          <ListOfSimpleCourses coursesData={onePageOfCourses}/>
        }</Loading>

        <Pagination className="-for-mobile" amountOfPages={this.state.amountOfPages} currentPage={this.state.currentPage} updateCurrentPage={this.updateCurrentPage}/>
      </div>

      <Footer/>

      <Helmet>
        <title>Memcode | All courses</title>
        <meta name="description" content="Learn existing courses on programming, maths and physics, or create your own."/> :
      </Helmet>
    </main>
}

export { Page_courses };
