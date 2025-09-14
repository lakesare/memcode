import { Link } from 'react-router-dom';
import StandardTooltip from '~/components/StandardTooltip';

class SortBySelect extends React.Component {
  static propTypes = {
    sortBy: PropTypes.oneOf(['random', 'popular', 'new']).isRequired,
    getUrlForNewSortBy: PropTypes.func.isRequired
  }

  possibleValues = {
    popular: 'Most Popular',
    new: 'Recently Created',
    random: 'Random'
  }

  renderDropdown = () =>
    <ul className="standard-tooltip-dropdown">
      {Object.keys(this.possibleValues).map((value) =>
        <li key={value}>
          <Link to={this.props.getUrlForNewSortBy(value)} className="dropdown-item">
            {this.possibleValues[value]}
          </Link>
        </li>
      )}
    </ul>

  render = () =>
    <StandardTooltip
      key={this.props.sortBy}
      tooltipEl={this.renderDropdown()}
      tooltipProps={{
        interactive: true,
        placement: 'bottom-end',
        trigger: 'mouseenter click',
        arrow: false
      }}
      width={120}
    >
      <button type="button" className="sort-by-dropdown-wrapper standard-dropdown-wrapper">
        {this.possibleValues[this.props.sortBy]}
        <i className="fa fa-caret-down"/>
      </button> 
    </StandardTooltip>
}

export default SortBySelect;
