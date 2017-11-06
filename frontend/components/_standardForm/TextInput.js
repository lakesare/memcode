/* eslint-disable */
import { FormLineLayout } from './components/FormLineLayout';

// why is there value={this.props.formState[name] || ''} in all inputs?
// to avoid this issue: https://github.com/twisty/formsy-react-components/issues/66
// when the initial this.props.formState is {}
class TextInput extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    updateFormState: PropTypes.func.isRequired,
    formState: PropTypes.object.isRequired,
    formValidation: PropTypes.object.isRequired,

    type: PropTypes.string
  }

  static defaultProps = {
    type: 'text'
  }

  updateFormState = (event) =>
    this.props.updateFormState({
      ...this.props.formState,
      [this.props.name]: event.target.value
    })

  render = () =>
    FormLineLayout(
      this.props,
      <input
        type={this.props.type}
        id={this.props.name} // for htmlFor
        value={this.props.formState[this.props.name] || ''}
        onChange={this.updateFormState}
      />,
      '-TextInput'
    )
}

export { TextInput };
