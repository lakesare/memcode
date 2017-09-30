import { Link } from 'react-router';
import css from './index.css';
class Search extends React.Component {
  static propTypes = {
    // currentUser: PropTypes.object
  }

  state = {
    searchString: ''
  }

  updateSearchString = (event) => {
    const newSearchString = event.target.value;
  }

  render = () =>
    <section className={`${css.search} search`}>
      <i className="fa fa-search"/>
      <input
        placeholder="Find a course..."
        onChange={this.updateSearchString}
        value={this.state.searchString}
        type="text"
      />
    </section>
}

export { Search };
