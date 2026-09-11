import Quill from 'quill';

class QuillEditor extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
    modules: PropTypes.object,
    placeholder: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    className: PropTypes.string
  }

  static defaultProps = {
    onChange: () => {},
    onFocus: () => {},
    onBlur: () => {}
  }

  constructor(props) {
    super(props);
    this.editingAreaRef = React.createRef();
    this.value = props.value;
  }

  selection = null;

  componentDidMount = () => {
    this.editor = new Quill(this.editingAreaRef.current, {
      theme: 'snow',
      modules: this.props.modules,
      placeholder: this.props.placeholder,
      readOnly: this.props.readOnly
    });
    this.editor.setContents(this.editor.clipboard.convert({ html: this.value }));
    this.editor.on('editor-change', this.onEditorChange);
  }

  componentWillUnmount = () => {
    this.editor.off('editor-change', this.onEditorChange);
  }

  componentDidUpdate = (prevProps) => {
    // [claude comment] guards against re-applying our own just-emitted content when `value` round-trips back as a prop
    if (this.props.value !== prevProps.value && this.props.value !== this.value) {
      const selection = this.editor.getSelection();
      this.value = this.props.value;
      this.editor.setContents(this.editor.clipboard.convert({ html: this.value }));
      if (selection) {
        Promise.resolve().then(() => this.editor.setSelection(selection));
      }
    }

    if (this.props.readOnly !== prevProps.readOnly) {
      if (this.props.readOnly) { this.editor.disable(); } else { this.editor.enable(); }
    }
  }

  onEditorChange = (eventName, rangeOrDelta) => {
    if (eventName === 'text-change') {
      const html = this.editor.root.innerHTML;
      if (html !== this.value) {
        this.value = html;
        this.props.onChange(html);
      }
    } else if (eventName === 'selection-change') {
      const hasGainedFocus = !this.selection && rangeOrDelta;
      const hasLostFocus = this.selection && !rangeOrDelta;
      this.selection = rangeOrDelta;

      if (hasGainedFocus) { this.props.onFocus(); } else if (hasLostFocus) { this.props.onBlur(); }
    }
  }

  // [claude comment] .editor is also reached directly by a fiber-walking hack in placeholdAndCreateImage.js
  getEditor = () => this.editor

  render = () =>
    <div className={`quill ${this.props.className || ''}`}>
      <div ref={this.editingAreaRef} />
    </div>
}

export default QuillEditor;
