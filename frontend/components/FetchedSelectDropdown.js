import onClickOutside from 'react-onclickoutside';

import orFalse from '~/services/orFalse';
import Loading from '~/components/Loading';

@onClickOutside
class FetchedSelectDropdown extends React.Component {
  static propTypes = {
    li: orFalse(PropTypes.object).isRequired,
    updateLi: PropTypes.func.isRequired,

    renderLi: PropTypes.func.isRequired,
    renderSelectedLi: PropTypes.func.isRequired,

    apiGetLis: PropTypes.func.isRequired,

    className: PropTypes.string,
    placeholder: PropTypes.string,
    noItemsFoundPlaceholder: PropTypes.string
  }

  static defaultProps = {
    className: '',
    placeholder: 'Please choose...',
    noItemsFoundPlaceholder: 'Nothing found'
  }

  state = {
    ifDropdownIsOpen: false,
    speLis: {}
  }

  componentDidMount() {
    this.props.apiGetLis((spe) => this.setState({ speLis: spe }));
  }

  updateLi = (value) => {
    this.closeDropdown();
    this.props.updateLi(value);
  }

  openDropdown  = () => this.setState({ ifDropdownIsOpen: true })
  closeDropdown = () => this.setState({ ifDropdownIsOpen: false })
  toggleDropdown = () => this.setState({ ifDropdownIsOpen: !this.state.ifDropdownIsOpen })

  handleClickOutside = this.closeDropdown

  render = () =>
    <section
      className={`
        dropdown-wrapper
        ${this.props.className}
        ${(this.state.ifDropdownIsOpen ? 'open' : '')}
      `}
    >
      <a className="toggler" onClick={this.toggleDropdown}>
        {this.props.li ?
          this.props.renderSelectedLi(this.props.li) :
          this.props.placeholder}
        <i className="fa fa-caret-down"/>
      </a>
      {
        this.state.ifDropdownIsOpen &&
      <div className="dropdown">
          <Loading spe={this.state.speLis}>{(values) =>
            <ul>
              {
                values.length === 0 ?
                  <li className="no-records-found">{this.props.noItemsFoundPlaceholder}</li> :
                  values.map((li, index) =>
                    <div key={index} className="li" onClick={() => this.updateLi(li)}>
                      {this.props.renderLi(li)}
                    </div>
                  )
              }
            </ul>
          }</Loading>
        </div>
      }
    </section>
}

export default FetchedSelectDropdown;
