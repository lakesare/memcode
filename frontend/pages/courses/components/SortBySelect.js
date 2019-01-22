import { Link } from 'react-router';

class SortBySelect extends React.Component {
  static propTypes = {
    sortBy: PropTypes.oneOf(['popular', 'new']).isRequired,
    getUrlForNewSortBy: PropTypes.func.isRequired
  }

  state = {
    ifDropdownIsOpen: false
  }

  toggleDropdown  = () => {
    this.setState({ ifDropdownIsOpen: !this.state.ifDropdownIsOpen });
  }

  updateSortBy = (sortBy) =>
    this.setState({ sortBy, currentPage: 1 }, this.apiGetCourses)

  render = () =>
    <section className="sort-by">
      <label>Sort By:</label>

      <section
        className={`
          standard-dropdown-wrapper
          ${(this.state.ifDropdownIsOpen ? 'open' : '')}
        `}
      >
        <button type="button" className="toggler" onClick={this.toggleDropdown}>
          {
            this.props.sortBy === 'popular' ?
              'Most Popular' :
              'Recently Created'
          }
          <i className="fa fa-caret-down"/>
        </button>
        {
          this.state.ifDropdownIsOpen &&
          <div className="standard-beige-dropdown">
            <ul onClick={this.toggleDropdown}>
              <li>
                <Link to={this.props.getUrlForNewSortBy('popular')}>Most Popular</Link>
              </li>
              <li>
                <Link to={this.props.getUrlForNewSortBy('new')}>Recently Created</Link>
              </li>
            </ul>
          </div>
        }
      </section>
    </section>
}

export default SortBySelect;
