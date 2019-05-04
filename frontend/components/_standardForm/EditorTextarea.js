import Editor from '~/components/Editor';
import FormLineLayout from './components/FormLineLayout';

class EditorTextarea extends React.Component {
  static propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    name: PropTypes.string.isRequired,
    updateFormState: PropTypes.func.isRequired,
    formState: PropTypes.object.isRequired,
    formValidation: PropTypes.object.isRequired
  }

  updateFormState = (newHtml) =>
    this.props.updateFormState({
      ...this.props.formState,
      [this.props.name]: newHtml
    })

  render = () =>
    <FormLineLayout
      label={this.props.label}
      name={this.props.name}
      formValidation={this.props.formValidation}
    >
      <Editor
        className="standard-input -EditorTextarea"
        editorState={this.props.formState[this.props.name]}
        updateEditorState={this.updateFormState}
      />
    </FormLineLayout>
}

export { EditorTextarea };
export default EditorTextarea;
