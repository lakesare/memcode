import CourseApi from '~/api/CourseApi';
import CourseCategoryApi from '~/api/CourseCategoryApi';
import hashToQueryString from '~/api/services/hashToQueryString';

import { Helmet } from 'react-helmet';
import { Header } from '~/components/Header';
import { Footer } from '~/components/Footer';
import { Loading } from '~/components/Loading';
import Pagination from '~/components/Pagination';
import { ListOfSimpleCourses } from '~/components/ListOfSimpleCourses';
import { ProfileNavigation } from '~/components/ProfileNavigation';
import CourseCategories from '~/appComponents/CourseCategories';
import SortBySelect from './components/SortBySelect';

import css from './index.css';

const getCategoryId = (props) => {
  const categoryId = props.location.query.categoryId;
  return categoryId ? parseInt(categoryId) : false;
};

const getCurrentPage = (props) => {
  const currentPage = props.location.query.page;
  return currentPage ? parseInt(currentPage) : 1;
};

const getSortBy = (props) => {
  const sortBy = props.location.query.sortBy;
  return sortBy ? sortBy : 'popular';
};

class Page_courses extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired
  }

  state = {
    speGetCourses: {},
    speGetCategories: {},
    // to avoid blinking pagination
    amountOfPages: 1
  }

  componentDidMount = () => {
    this.apiGetCourses();
    this.apiGetCategories();
  }

  componentDidUpdate = (prevProps) => {
    if (
      getCategoryId(prevProps) !== getCategoryId(this.props) ||
      getCurrentPage(prevProps) !== getCurrentPage(this.props) ||
      getSortBy(prevProps) !== getSortBy(this.props)
    ) {
      this.apiGetCourses();
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
        pageNumber: getCurrentPage(this.props),
        sortBy: getSortBy(this.props),
        ...(getCategoryId(this.props) ?
          { courseCategoryId: getCategoryId(this.props) } :
          {}
        )
      }
    )
      .then(({ amountOfPages }) =>
        this.setState({ amountOfPages })
      )

  getUrlForNewPageNumber = (pageN) => {
    const newQuery = { ...this.props.location.query, page: pageN };
    return this.props.location.pathname + '?' + hashToQueryString(newQuery);
  }

  getUrlForNewSortBy = (sortBy) => {
    const newQuery = { ...this.props.location.query, page: 1, sortBy };
    return this.props.location.pathname + '?' + hashToQueryString(newQuery);
  }

  renderPagination = (className = '') =>
    <Pagination
      className={className}
      amountOfPages={this.state.amountOfPages}
      currentPage={getCurrentPage(this.props)}
      getUrlForNewPageNumber={this.getUrlForNewPageNumber}
    />

  render = () =>
    <main className={css.main}>
      <Header/>
      <ProfileNavigation/>

      <div className="container">
        <div className="sorting-options">
          <SortBySelect
            sortBy={getSortBy(this.props)}
            getUrlForNewSortBy={this.getUrlForNewSortBy}
          />
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
