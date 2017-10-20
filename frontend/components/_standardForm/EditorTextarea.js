import { Editor } from '~/components/Editor';
import { FormLineLayout } from './components/FormLineLayout';

class EditorTextarea extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
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
    FormLineLayout(
      this.props,
      <Editor
        editorState={this.props.formState[this.props.name] || ''}
        updateEditorState={this.updateFormState}
      />,
      '-EditorTextarea'
    )
}

export { EditorTextarea };
