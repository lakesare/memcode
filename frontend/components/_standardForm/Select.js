import FormLineLayout from './components/FormLineLayout';
import ReactSelectWrapper from '~/components/Select';

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

  deriveOptions = () =>
    Object.keys(this.props.possibleValues).map((value) => ({
      value,
      label: this.props.possibleValues[value]
    }))

  deriveValue = () => {
    const value = String(this.props.formState[this.props.name]);
    return Object.prototype.hasOwnProperty.call(this.props.possibleValues, value) ? value : null;
  }

  render = () =>
    <FormLineLayout
      label={this.props.label}
      name={this.props.name}
      formValidation={this.props.formValidation}
    >
      <ReactSelectWrapper
        inputId={this.props.name}
        options={this.deriveOptions()}
        value={this.deriveValue()}
        updateValue={this.updateFormState}
      />
    </FormLineLayout>
}

export { Select };
export default Select;
