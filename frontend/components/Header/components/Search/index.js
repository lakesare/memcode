import * as CourseApi from '~/api/Course';

import { Loading } from '~/components/Loading';
import { Course } from './components/Course';

import css from './index.css';

class Search extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object
  }

  state = {
    searchString: '',
    speSearch: {}
  }

  apiSearch = (searchString) =>
    CourseApi.selectSearch(
      (spe) => this.setState({ speSearch: spe }),
      searchString
    )

  updateSearchString = (event) => {
    const searchString = event.target.value;
    this.setState({ searchString });
    if (searchString.length === 0) {
      // hide the dropdown, reset the found results
      this.setState({ speSearch: {} });
    } else {
      this.apiSearch(searchString);
    }
  }

  render = () =>
    <section className={`${css.search} search`}>
      <div className="toggler">
        <i className="fa fa-search"/>
        <input
          placeholder="Find a course..."
          onChange={this.updateSearchString}
          value={this.state.searchString}
          type="text"
          autoComplete={false}
          autoCorrect={false}
          autoCapitalize={false}
          spellCheck={false}
        />
      </div>

      <div className="standard-dropdown">
        <Loading spe={this.state.speSearch}>{(courseDatas) =>
          <ul>
            {courseDatas.map((courseData) =>
              <Course
                key={courseData.course.id}
                courseData={courseData}
                currentUser={this.props.currentUser}
                searchString={this.state.searchString}
              />
            )}
          </ul>
        }</Loading>
      </div>
    </section>
}

export { Search };
