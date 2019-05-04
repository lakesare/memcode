import FormLineLayout from './components/FormLineLayout';
import SelectDropdown from '~/components/SelectDropdown';

// why is there value={this.props.formState[name] || ''} in all inputs?
// to avoid this issue: https://github.com/twisty/formsy-react-components/issues/66
// when the initial this.props.formState is {}
class Select extends React.Component {
  static propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    name: PropTypes.string.isRequired,
    updateFormState: PropTypes.func.isRequired,
    formState: PropTypes.object.isRequired,
    formValidation: PropTypes.object.isRequired,

    possibleValues: PropTypes.object.isRequired
  }

  updateFormState = (value) =>
    this.props.updateFormState({
      ...this.props.formState,
      [this.props.name]: value
    })

  render = () =>
    <FormLineLayout
      label={this.props.label}
      name={this.props.name}
      formValidation={this.props.formValidation}
    >
      <SelectDropdown
        value={String(this.props.formState[this.props.name])}
        updateValue={this.updateFormState}
        possibleValues={this.props.possibleValues}
        className="standard-input -Select standard-dropdown-wrapper"
        dropdownClassName="standard-dropdown -purple"
      />
    </FormLineLayout>
}

export { Select };
export default Select;
