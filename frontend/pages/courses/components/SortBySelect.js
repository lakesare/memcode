import { Link } from 'react-router-dom';
import SelectDropdown from '~/components/SelectDropdown';

class SortBySelect extends React.Component {
  static propTypes = {
    sortBy: PropTypes.oneOf(['random', 'popular', 'new']).isRequired,
    getUrlForNewSortBy: PropTypes.func.isRequired
  }

  render = () =>
    <SelectDropdown
      className="sort-by-dropdown-wrapper standard-dropdown-wrapper standard-input -Select"
      dropdownClassName="standard-dropdown -purple"
      value={this.props.sortBy}
      possibleValues={{
        random: 'Random',
        popular: 'Most Popular',
        new: 'Recently Created',
      }}
      renderLi={(value, humanValue) =>
        <Link to={this.props.getUrlForNewSortBy(value)}>{humanValue}</Link>
      }
      renderButtonInLi={false}
    />
}

export default SortBySelect;
