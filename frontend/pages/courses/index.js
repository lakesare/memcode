import * as CourseApi from '~/api/Course';
import CourseCategoryApi from '~/api/CourseCategoryApi';

import { Helmet } from 'react-helmet';
import { Header } from '~/components/Header';
import { Footer } from '~/components/Footer';
import { Loading } from '~/components/Loading';
import Pagination from '~/components/Pagination';
import { SelectDropdown } from '~/components/SelectDropdown';
import { ListOfSimpleCourses } from '~/components/ListOfSimpleCourses';
import { ProfileNavigation } from '~/components/ProfileNavigation';
import CourseCategories from '~/appComponents/CourseCategories';

import css from './index.css';

const getCategoryId = (props) => {
  const categoryId = props.location.query.categoryId;
  return categoryId ? parseInt(categoryId) : false;
};

class Page_courses extends React.Component {
  state = {
    speGetCourses: {},
    speGetCategories: {},
    sortBy: 'popular',
    currentPage: 1,
    // to avoid blinking pagination
    amountOfPages: 1
  }

  componentDidMount = () => {
    this.apiGetCourses();
    this.apiGetCategories();
  }

  componentDidUpdate = (prevProps) => {
    if (getCategoryId(prevProps) !== getCategoryId(this.props)) {
      this.setState({ currentPage: 1 }, this.apiGetCourses);
    }
  }

  apiGetCategories = () =>
    CourseCategoryApi.selectWithGroups(
      (spe) => this.setState({ speGetCategories: spe })
    )

  apiGetCourses = () =>
    CourseApi.selectPublic(
      (spe) => this.setState({ speGetCourses: spe }),
      {
        pageSize: 16,
        pageNumber: this.state.currentPage,
        sortBy: this.state.sortBy,
        ...(
          getCategoryId(this.props) ?
          { courseCategoryId: getCategoryId(this.props) } :
          {}
        )
      }
    )
      .then(({ amountOfPages }) =>
        this.setState({ amountOfPages })
      )

  updateSortBy = (sortBy) =>
    this.setState({ sortBy, currentPage: 1 }, this.apiGetCourses)

  updateCurrentPage = (currentPage) =>
    this.setState({ currentPage }, this.apiGetCourses)

  renderPagination = (className = '') =>
    <Pagination
      className={className}
      amountOfPages={this.state.amountOfPages}
      currentPage={this.state.currentPage}
      updateCurrentPage={this.updateCurrentPage}
    />

  render = () =>
    <main className={css.main}>
      <Header/>
      <ProfileNavigation/>

      <div className="container">
        <div className="sorting-options">
          <section className="sort-by">
            <label>Sort By:</label>

            <SelectDropdown
              className="standard-dropdown-wrapper"
              value={this.state.sortBy}
              updateValue={this.updateSortBy}
              possibleValues={{
                popular: 'Most popular',
                new: 'Recently created'
              }}
            />
          </section>

          {this.renderPagination()}
        </div>

        <div className="courses-and-nav">
          <Loading enabledStatuses={['failure', 'success']} spe={this.state.speGetCategories}>{({ courseCategoryGroups, courseCategories }) =>
            <CourseCategories
              courseCategoryId={getCategoryId(this.props)}
              courseCategoryGroups={courseCategoryGroups}
              courseCategories={courseCategories}
            />
          }</Loading>

          <Loading className="loading-courses" spe={this.state.speGetCourses}>{({ onePageOfCourses }) =>
            <ListOfSimpleCourses coursesData={onePageOfCourses}/>
          }</Loading>
        </div>

        {this.renderPagination('-for-mobile')}
      </div>

      <Footer/>

      <Helmet>
        <title>Memcode | Courses</title>
        <meta name="description" content="Learn existing courses on programming, maths and physics, or create your own."/> :
      </Helmet>
    </main>
}

export { Page_courses };
