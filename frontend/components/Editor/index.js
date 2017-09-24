import { standardToolbarContainer } from '~/services/quill/standardToolbarContainer';
import ReactQuill from 'react-quill';

class Editor extends React.Component {
  static propTypes = {
    editorState: PropTypes.string.isRequired,
    updateEditorState: PropTypes.func,

    readOnly: PropTypes.bool,
    placeholder: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),

    onFocusChange: PropTypes.func,
    toolbarContainer: PropTypes.array,
    toolbarHandlers: PropTypes.object
  };

  static defaultProps = {
    readOnly: false,
    placeholder: '',
    updateEditorState: (a) => a,
    onFocusChange: () => {},

    toolbarContainer: standardToolbarContainer,
    toolbarHandlers: {}
  }

  // range: Range {index: 5, length: 0} OR null
  onChangeSelection = (range) => {
    this.props.onFocusChange(!!range);
  }

  render = () =>
    <ReactQuill
      value={this.props.editorState}
      onChange={this.props.updateEditorState}
      readOnly={this.props.readOnly}

      modules={{
        syntax: false, // Include syntax module
        toolbar: {
          container: this.props.toolbarContainer,
          handlers: this.props.toolbarHandlers
        },
        // https://github.com/zenoamaro/react-quill/issues/250
        clipboard: { matchVisual: false },
        imageResize: {
          modules: ['Resize']
        },
        imageDrop: true
      }}

      onChangeSelection={this.onChangeSelection}
      placeholder={this.props.placeholder}
    />
}

export { Editor };
