import onClickOutside from 'react-onclickoutside';

import { orFalse } from '~/services/orFalse';

@onClickOutside
class SelectDropdown extends React.Component {
  static propTypes = {
    updateValue: PropTypes.func.isRequired,
    value: orFalse(PropTypes.string).isRequired,

    possibleValues: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object
    ]).isRequired,

    ifClearIsPossible: PropTypes.bool,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
  }

  static defaultProps = {
    className: '',
    placeholder: 'Please select',
    ifClearIsPossible: false,
    readOnly: false
  }

  state = { ifDropdownIsOpen: false }

  onSelect = (value) => {
    this.closeDropdown();
    this.props.updateValue(value);
  }

  toggleDropdown  = () => {
    if (!this.props.readOnly) {
      this.setState({ ifDropdownIsOpen: !this.state.ifDropdownIsOpen });
    }
  }
  closeDropdown = () => this.setState({ ifDropdownIsOpen: false })
  handleClickOutside = this.closeDropdown

  // ['a', 'b'] => { a: 'a', b: 'b' }
  arrayToMap = (array) => {
    const hash = {};
    array.forEach((value) => {
      hash[value] = value;
    });
    return hash;
  }

  render = () => {
    const apiToHumanMapOfPossibleValues =
      Array.isArray(this.props.possibleValues) ?
      this.arrayToMap(this.props.possibleValues) :
      this.props.possibleValues;

    console.log(this.props);
    return <section
      className={`
        select-dropdown
        ${this.props.className}
        ${(this.state.ifDropdownIsOpen ? 'open' : '')}
      `}
    >
      <button type="button" className="toggler" onClick={this.toggleDropdown}>
        {
          this.props.value ?
            apiToHumanMapOfPossibleValues[this.props.value] :
            this.props.placeholder
        }
        {
          !this.props.readOnly &&
          <i className="fa fa-caret-down"/>
        }
      </button>
      {
        this.state.ifDropdownIsOpen &&
        <ul className="standard-dropdown">
          {Object.keys(apiToHumanMapOfPossibleValues).map((value) =>
            <li
              key={value}
              onClick={() => this.onSelect(value)}
            >{apiToHumanMapOfPossibleValues[value]}</li>
          )}
          {
            this.props.ifClearIsPossible &&
            <li
              onClick={() => this.onSelect(false)}
            >-</li>
          }
        </ul>
      }
    </section>;
  }
}

export { SelectDropdown };
