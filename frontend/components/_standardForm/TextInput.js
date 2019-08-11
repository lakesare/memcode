import FormLineLayout from './components/FormLineLayout';

class TextInput extends React.Component {
  static propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    name: PropTypes.string.isRequired,

    formState: PropTypes.object.isRequired,
    updateFormState: PropTypes.func.isRequired,

    formValidation: PropTypes.object.isRequired,

    type: PropTypes.string,
    autoFocus: PropTypes.boolean
  }

  static defaultProps = {
    type: 'text',
    autoFocus: false
  }

  updateFormState = (event) =>
    this.props.updateFormState({
      ...this.props.formState,
      [this.props.name]: event.target.value
    })

  render = () =>
    <FormLineLayout
      label={this.props.label}
      name={this.props.name}
      formValidation={this.props.formValidation}
    >
      <input
        className="standard-input -TextInput"
        type={this.props.type}
        id={this.props.name} // for htmlFor
        value={this.props.formState[this.props.name]}
        onChange={this.updateFormState}
        autoComplete="off"
        autoFocus={this.props.autoFocus}
      />
    </FormLineLayout>
}

export { TextInput };
export default TextInput;
