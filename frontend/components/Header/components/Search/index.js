import * as Course from '~/api/Course';

import { Link } from 'react-router';
import { Loading } from '~/components/Loading';

import css from './index.css';

class Search extends React.Component {
  static propTypes = {
    // currentUser: PropTypes.object
  }

  state = {
    searchString: '',
    speSearch: {}
  }

  apiSearch = (searchString) =>
    Course.selectSearch(
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

  bolden = (title, searchString) => {
    // "hello", "ll" => 2
    const beginsToMatchAt = title.toLowerCase().indexOf(
      searchString.toLowerCase()
    );
    const endsToMatchAt = beginsToMatchAt + searchString.length;
    const boldenedString =
      title.slice(0, beginsToMatchAt) +
      '<b>' +
      title.slice(beginsToMatchAt, endsToMatchAt) +
      '</b>' +
      title.slice(endsToMatchAt);
    return <div dangerouslySetInnerHTML={{ __html: boldenedString }}/>;
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
        <Loading spe={this.state.speSearch}>{(results) =>
          <ul>
            {results.map(({ course }) =>
              <li key={course.id}>
                <Link to={`/courses/${course.id}`}>
                  {this.bolden(course.title, this.state.searchString)}
                </Link>
              </li>
            )}
          </ul>
        }</Loading>
      </div>
    </section>
}

export { Search };
