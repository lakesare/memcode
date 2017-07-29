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

    onFocusChange: PropTypes.func
  };

  static defaultProps = {
    readOnly: false,
    placeholder: '',
    updateEditorState: (a) => a,
    onFocusChange: () => {}
  }

  // range: Range {index: 5, length: 0} OR null
  onChangeSelection = (range) => {
    this.props.onFocusChange(!!range);
  }

  render = () =>
    <ReactQuill
      className=""
      value={this.props.editorState}
      onChange={this.props.updateEditorState}
      readOnly={this.props.readOnly}

      modules={{
        syntax: false,              // Include syntax module

        toolbar: [
          ['bold', 'italic'],
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }],
          ['link', 'image']
        ],
      }}

      onChangeSelection={this.onChangeSelection}
      placeholder={this.props.placeholder}
    />
}

export { Editor };
