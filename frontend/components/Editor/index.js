import standardToolbarContainer from '~/services/quill/standardToolbarContainer';
import dropOrPasteImageHandler from '~/services/quill/handlers/dropOrPasteImageHandler';
import uploadImageHandler      from '~/services/quill/handlers/uploadImageHandler';
import markAsAnswerHandler     from '~/services/quill/handlers/markAsAnswerHandler';
import codeBlockHandler        from '~/services/quill/handlers/codeBlockHandler';
import quoteHandler            from '~/services/quill/handlers/quoteHandler';
import superScriptHandler      from '~/services/quill/handlers/superScriptHandler';
import subScriptHandler        from '~/services/quill/handlers/subScriptHandler';

import ReactQuill from 'react-quill';

// ___Why is it not defined inside the render() function?
//    We must define it here, otherwise we'll be getting infinite loops!
const bindings = {
  // all of these are making TAB only function in code blocks! (https://github.com/quilljs/quill/blob/develop/modules/keyboard.js#L184)
  tab:          false,
  outdent:      false,
  indent:       false,
  'remove tab': false,

  superScriptHandlerOnDot: {
    key: 190, // .
    shortKey: true,
    shiftKey: true,
    handler: superScriptHandler
  },

  subScriptHandlerOnComma: {
    key: 188, // ,
    shortKey: true,
    shiftKey: true,
    handler: subScriptHandler
  },

  codeBlockOnCmdC: {
    key: 'C',
    // CMD and CTRL
    shortKey: true,
    shiftKey: true,
    handler: codeBlockHandler
  },

  quoteOnCmdK: {
    key: 'K',
    // CMD and CTRL
    shortKey: true,
    shiftKey: true,
    handler: quoteHandler
  },

  markAsAnswerOnCmdA: {
    key: 'ENTER',
    shortKey: true,
    shiftKey: true,
    handler: markAsAnswerHandler
  },

  blurOnEsc: {
    key: 'Escape',
    handler: () => {
      document.activeElement.blur();
    }
  }
};

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
    toolbarHandlers: PropTypes.object,
    className: PropTypes.string
  };

  static defaultProps = {
    readOnly: false,
    placeholder: '',
    updateEditorState: (a) => a,
    onFocusChange: () => {},

    toolbarContainer: standardToolbarContainer,
    toolbarHandlers: {},
    className: ''
  }

  constructor(props) {
    super(props);
    this.quillRef = React.createRef();
  }

  componentDidMount = () => {
    this.uiMakeToolbarButtonsUnfocusable();
  }

  uiMakeToolbarButtonsUnfocusable = () => {
    const quillComponent = this.quillRef.current;
    const qlContainerEl = quillComponent.editor.container;
    const quillElement = qlContainerEl.parentElement;
    const buttons = quillElement.querySelectorAll('.ql-toolbar button');

    buttons.forEach((button) => button.setAttribute('tabindex', '-1'));
  }

  onBlur = () => {
    this.props.onFocusChange(false);
  }

  onFocus = () => {
    this.props.onFocusChange(true);
  }

  modules = {
    // formula: true,          // Include formula module
    // maybe include syntax module sometime
    // syntax: false,
    toolbar: {
      container: this.props.toolbarContainer,
      handlers: {
        ...this.props.toolbarHandlers,
        // eslint-disable-next-line object-shorthand
        image: function uploadImageHandlerWrapper() {
          uploadImageHandler(this.quill, { onSuccess: this.onBlur });
        }
      }
    },

    keyboard: {
      bindings
    },

    // https://github.com/zenoamaro/react-quill/issues/250
    clipboard: { matchVisual: false },
    imageResize: {
      modules: ['Resize']
    },
    moduleDropOrPasteImage: {
      // add a custom image handler
      handler: (file, quill) => {
        dropOrPasteImageHandler(file, quill, { onSuccess: this.onBlur });
      }
    }
  }

  render = () =>
    <ReactQuill
      className={this.props.className}
      value={this.props.editorState}
      onChange={this.props.updateEditorState}
      readOnly={this.props.readOnly}

      ref={this.quillRef}

      modules={this.modules}

      onBlur={this.onBlur}
      onFocus={this.onFocus}
      placeholder={this.props.placeholder}
    />
}

export { Editor };
export default Editor;
