import { Link } from 'react-router-dom';
import SelectDropdown from '~/components/SelectDropdown';

class SortBySelect extends React.Component {
  static propTypes = {
    sortBy: PropTypes.oneOf(['popular', 'new']).isRequired,
    getUrlForNewSortBy: PropTypes.func.isRequired
  }

  render = () =>
    <section className="sort-by">
      <label>Sort By:</label>

      <section className="standard-dropdown-wrapper standard-input -Select">
        <SelectDropdown
          value={this.props.sortBy}
          possibleValues={{
            popular: <Link to={this.props.getUrlForNewSortBy('popular')}>Most Popular</Link>,
            new: <Link to={this.props.getUrlForNewSortBy('new')}>Recently Created</Link>
          }}
          dropdownClassName="standard-dropdown -purple"
        />
      </section>
    </section>
}

export default SortBySelect;
