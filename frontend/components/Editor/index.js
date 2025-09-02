import standardToolbarContainer from '~/services/quill/standardToolbarContainer';
import dropOrPasteImageHandler from '~/services/quill/handlers/dropOrPasteImageHandler';
import msWordPasteMatchers     from '~/services/quill/msWordPasteMatchers';
import uploadImageHandler      from '~/services/quill/handlers/uploadImageHandler';
import markAsAnswerHandler     from '~/services/quill/handlers/markAsAnswerHandler';
import codeBlockHandler        from '~/services/quill/handlers/codeBlockHandler';
import codeLineHandler         from '~/services/quill/handlers/codeLineHandler';
import quoteHandler            from '~/services/quill/handlers/quoteHandler';
import superScriptHandler      from '~/services/quill/handlers/superScriptHandler';
import subScriptHandler        from '~/services/quill/handlers/subScriptHandler';
import formulaHandler        from '~/services/quill/handlers/formulaHandler';

import ReactQuill from 'react-quill';

import { tippy } from '@tippyjs/react';

// ___Why is it not defined inside the render() function?
//    We must define it here, otherwise we'll be getting infinite loops!
const bindings = {
  // all of these are making TAB only function in code blocks! (https://github.com/quilljs/quill/blob/develop/modules/keyboard.js#L184)
  tab:          false,
  // outdent:      false,
  // indent:       false,
  'remove tab': false,

  superScriptHandlerOnDot: {
    key: 190, // .
    // CMD and CTRL
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
    shortKey: true,
    shiftKey: true,
    handler: codeBlockHandler
  },

  codeLineOnCmdM: {
    key: 'M',
    shortKey: true,
    shiftKey: true,
    handler: codeLineHandler
  },

  quoteOnCmdK: {
    key: 'K',
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

  insertFormulaOnCmdF: {
    key: 'F', // .
    // CMD and CTRL
    shortKey: true,
    shiftKey: true,
    handler: formulaHandler
  },

  // blurOnEsc: {
  //   key: 'Escape',
  //   handler: () => {
  //     document.activeElement.blur();
  //   }
  // }
};

const tip = (button, explanation, shortcut, instruction) => {
  const explanationDiv = `<div class="explanation">${explanation}</div>`;
  const shortcutDiv = shortcut ? `<div class="shortcut">${shortcut}</div>` : '';
  const instructionDiv = instruction ? `<div class="instruction">${instruction}</div>` : '';
  tippy(button, {
    content: `<div class="quill-toolbar-tooltip">${explanationDiv} ${shortcutDiv} ${instructionDiv}</div>`,
    allowHTML: true,
    theme: '-dark'
  });
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
    className: PropTypes.string,
    onUploadStateChange: PropTypes.func
  }

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

  state = {
    focusedAtLeastOnce: false,
    pendingUploads: new Set() // Track ongoing image uploads
  }

  componentDidMount = () => {
    this.uiMakeToolbarButtonsUnfocusable();
  }

  // Methods to track upload state
  addPendingUpload = (uploadId) => {
    this.setState(prevState => {
      const newPendingUploads = new Set(prevState.pendingUploads);
      newPendingUploads.add(uploadId);
      return { pendingUploads: newPendingUploads };
    }, () => {
      if (this.props.onUploadStateChange) {
        this.props.onUploadStateChange(this.state.pendingUploads.size > 0);
      }
    });
  }

  removePendingUpload = (uploadId) => {
    this.setState(prevState => {
      const newPendingUploads = new Set(prevState.pendingUploads);
      newPendingUploads.delete(uploadId);
      return { pendingUploads: newPendingUploads };
    }, () => {
      if (this.props.onUploadStateChange) {
        this.props.onUploadStateChange(this.state.pendingUploads.size > 0);
      }
    });
  }

  hasPendingUploads = () => {
    return this.state.pendingUploads.size > 0;
  }

  uiMakeToolbarButtonsUnfocusable = () => {
    const quillComponent = this.quillRef.current;
    const qlContainerEl = quillComponent.editor.container;
    const quillElement = qlContainerEl.parentElement;
    const buttons = quillElement.querySelectorAll('.ql-toolbar button');

    buttons.forEach((button) => button.setAttribute('tabindex', '-1'));

    buttons.forEach((button) => {
      switch (button.className) {
        case 'ql-bold':       { tip(button, 'Bold', '⌘ B'); break; }
        case 'ql-italic':     { tip(button, 'Italic', '⌘ I'); break; }
        case 'ql-underline':  { tip(button, 'Underline', '⌘ U'); break; }
        case 'ql-code':       { tip(button, 'Inline code', '⌘ Shift M'); break; }
        case 'ql-blockquote': { tip(button, 'Quote', '⌘ Shift K'); break; }
        case 'ql-code-block': { tip(button, 'Block of code', '⌘ Shift C'); break; }
        case 'ql-link':       { tip(button, 'Link', null, 'Select some text and click here'); break; }
        case 'ql-image':      { tip(button, 'Image', null, 'You can also paste/drop your image'); break; }
        case 'ql-clean':      { tip(button, 'Clear formatting'); break; }
        case 'ql-formula':    { tip(button, 'Insert KaTeX formula', '⌘ Shift F'); break; }
        case 'ql-answer':     { tip(button, 'Answer', '⌘ Shift ENTER', 'Select some text, and mark it as an answer.<br/>Use | to provide alternative answers.'); break; }
        case 'ql-list': {
          if (button.value === 'ordered') {
            tip(button, 'Ordered List', null, 'Type \'1.\'');
          } else if (button.value === 'bullet') {
            tip(button, 'Unordered List', null, 'Type \'-\'');
          }
          break;
        }
        case 'ql-script': {
          if (button.value === 'sub') {
            tip(button, 'Subscript', '⌘ Shift ,');
          } else if (button.value === 'super') {
            tip(button, 'Superscript', '⌘ Shift .');
          }
          break;
        }
      }
    });
  }

  onBlur = () => {
    this.props.onFocusChange(false);
  }

  onFocus = () => {
    this.setState({ focusedAtLeastOnce: true });
    this.props.onFocusChange(true);
  }

  // (content, delta, source, editor)
  onChange = (content) => {
    // This is needed because the 'SAVE/SAVED' label next to the problem depends on whether api version of content === state version. Quill changes the content on mount in some cases, which would result in 'SAVE' button appearing on load. We don't want it, so let's wait for the first focus event!
    if (this.state.focusedAtLeastOnce || this.props.editorState.includes('placeholder-for-loading-image')) {
      this.props.updateEditorState(content);
    }
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
          uploadImageHandler(this.quill, {
            onSuccess: this.onBlur,
            editorComponent: this
          });
        }.bind(this)
      }
    },

    keyboard: {
      bindings
    },

    clipboard: {
      // https://github.com/zenoamaro/react-quill/issues/250
      matchVisual: false,
      // https://github.com/lakesare/memcode/pull/163
      matchers: msWordPasteMatchers
    },
    imageResize: {
      modules: ['Resize']
    },
    moduleDropOrPasteImage: {
      // add a custom image handler
      handler: (file, quill) => {
        dropOrPasteImageHandler(file, quill, {
          onSuccess: this.onBlur,
          editorComponent: this
        });
      }
    }
  }

  render = () =>
    <ReactQuill
      className={this.props.className}
      value={this.props.editorState}
      onChange={this.onChange}
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
