import CourseApi from '~/api/CourseApi';

import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Main from '~/appComponents/Main';
import Loading from '~/components/Loading';
import Pagination from '~/components/Pagination';
import ListOfCourseCards from '~/appComponents/ListOfCourseCards';
import CourseCategories from '~/appComponents/CourseCategories';
import SortBySelect from './components/SortBySelect';

import css from './index.css';

const getCategoryId = (props) => {
  const categoryId = getQuery(props).get('categoryId');
  return categoryId ? parseInt(categoryId) : false;
};

const getCurrentPage = (props) => {
  const currentPage = getQuery(props).get('page');
  return currentPage ? parseInt(currentPage) : 1;
};

const getSortBy = (props) => {
  const sortBy = getQuery(props).get('sortBy');
  return sortBy ? sortBy : 'popular';
};

const getQuery = (props) =>
  new URLSearchParams(props.location.search);

@withRouter
@connect(
  (state) => ({
    My: state.global.My
  }),
)
class Page_courses extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    My: PropTypes.object.isRequired
  }

  state = {
    speGetCourses: {},
    // to avoid blinking pagination
    amountOfPages: 1,
    ifCoursesAreLoading: false,
    searchString: ''
  }

  componentDidMount = () => {
    this.apiGetCourses();
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

  apiGetCourses = () => {
    const searchString = this.state.searchString;
    CourseApi.selectPublic(
      (spe) => {
        // if there are already some courses
        if (this.state.speGetCourses.payload) {
          if (spe.status === 'success') {
            // otherwise the slower queries will be shown after when we've already entered some new query!
            if (this.state.searchString !== searchString) return;
            this.setState({ speGetCourses: spe, amountOfPages: spe.payload.amountOfPages, ifCoursesAreLoading: false });
          } else {
            this.setState({ ifCoursesAreLoading: true });
          }
        } else {
          if (spe.status === "success") {
            this.setState({ speGetCourses: spe, amountOfPages: spe.payload.amountOfPages });
          } else {
            this.setState({ speGetCourses: spe });
          }
        }
      },
      {
        pageSize: 16,
        pageNumber: getCurrentPage(this.props),
        sortBy: getSortBy(this.props),
        ...(getCategoryId(this.props) ?
          { courseCategoryId: getCategoryId(this.props) } :
          {}
        ),
        searchString
      }
    );
  }

  getUrlForNewPageNumber = (pageN) => {
    const newQuery = getQuery(this.props);
    newQuery.set('page', pageN);
    return this.props.location.pathname + '?' + newQuery.toString();
  }

  getUrlForNewSortBy = (sortBy) => {
    const newQuery = getQuery(this.props);
    newQuery.set('page', 1);
    newQuery.set('sortBy', sortBy);
    return this.props.location.pathname + '?' + newQuery.toString();
  }

  getCurrentCategoryName = (courseCategories) => {
    const currentCategoryId = getCategoryId(this.props);
    if (currentCategoryId) {
      return courseCategories.find((category) => category.id === currentCategoryId).name;
    } else {
      return 'Courses';
    }
  }

  updateSearchString = (event) => {
    const searchString = event.target.value;
    this.setState({ searchString }, this.apiGetCourses);
  }

  renderPagination = (className = '') =>
    <Pagination
      className={className}
      amountOfPages={this.state.amountOfPages}
      currentPage={getCurrentPage(this.props)}
      getUrlForNewPageNumber={this.getUrlForNewPageNumber}
    />

  renderSearchBar = (className = "") =>
    <div className={`search-bar ${className}`}>
      <i className="material-icons">search</i>
      <input
        onChange={this.updateSearchString}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        value={this.state.searchString}
        type="search"

        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="off"
      />
    </div>

  render = () =>
    <Main className={css.main}>
      <Loading spe={this.props.My.speCategories}>{({ courseCategoryGroups, courseCategories }) =>
        <div className="container standard-navigation_and_courses">
          <div className="left">
            {this.renderSearchBar("for-desktop")}
            <CourseCategories
              selectedCourseCategoryId={getCategoryId(this.props)}
              courseCategoryGroups={courseCategoryGroups}
              courseCategories={courseCategories}
              ifShowAmountOfCoursesInCategory={false}
            />
          </div>

          <div className="right">
            <div className="title_and_sorting">
              <h1 className="title">{this.getCurrentCategoryName(courseCategories)}</h1>


              <SortBySelect
                sortBy={getSortBy(this.props)}
                getUrlForNewSortBy={this.getUrlForNewSortBy}
              />
            </div>

            {this.renderSearchBar("for-mobile")}
            {this.renderPagination("for-desktop")}

            <Loading className="list-of-courses-loading" spe={this.state.speGetCourses}>{({ onePageOfCourses }) =>
              <ListOfCourseCards
                className={`list-of-courses ${this.state.ifCoursesAreLoading ? '-loading' : ''}`}
                type="simple"
                courseDtos={onePageOfCourses}
              />
            }</Loading>

            {this.renderPagination("for-mobile")}
          </div>
        </div>
      }</Loading>

      <Helmet>
        <title>Memcode | Courses</title>
        <meta name="description" content="Learn existing courses on programming, maths and physics, or create your own."/> :
      </Helmet>
    </Main>
}

export default Page_courses;
