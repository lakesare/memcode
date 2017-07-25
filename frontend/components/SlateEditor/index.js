
import { Editor } from 'slate';

import { EditAnswerPlugin } from '~/services/slatePlugins/EditAnswerPlugin';
import { CodePlugin } from '~/services/slatePlugins/CodePlugin';
import { RichTextPlugin } from '~/services/slatePlugins/RichTextPlugin';

import EditCode from 'slate-edit-code';

const editCode = EditCode({ containerType: 'codeBlock' });

const schema = {
};

class SlateEditor extends React.Component {
  static propTypes = {
    editorState: PropTypes.object.isRequired,
    updateEditorState: PropTypes.func,

    readOnly: PropTypes.bool,
    placeholder: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ])
  }

  static defaultProps = {
    readOnly: false,
    placeholder: '',
    updateEditorState: (a) => a
  }

  componentDidUpdate() {
    // console.log(this.props.editorState);
  }

  onToggleCode = () => {
    this.props.updateEditorState(
      editCode.transforms.toggleCodeBlock(this.props.editorState.transform(), 'paragraph')
        .focus()
        .apply()
    );
  }

  render = () =>
    <section>

      <div onClick={this.onToggleCode}>
        {
          editCode.utils.isInCodeBlock(this.props.editorState) ?
            <i style={{ color: 'grey' }} className="fa fa-code"/> :
            <i style={{ color: 'blue' }} className="fa fa-code"/>
        }
      </div>


      <Editor
        className="hi"
        schema={schema}
        state={this.props.editorState}
        onChange={this.props.updateEditorState}

        plugins={[EditAnswerPlugin(), CodePlugin(), RichTextPlugin()]}

        placeholder={this.props.placeholder}
        readOnly={this.props.readOnly}
      />

    </section>
}
// <pre id="log"/>

export { SlateEditor };




// decorate: (text, node) => {
//   const oldFirstCharacter = text.characters.get(0)
//   marks = firstCharacter.marks.add(
//     Mark.create({ type: 'bold' })
//   )
//   newFirstCharacter = firstCharacter.merge({ marks })
//   newCharacters = text.characters.set(0, newFirstCharacter)
//   return newCharacters
// }


// import { Editor, Raw } from '../..'
// import React from 'react'
// import initialState from './state.json'

// const schema = {
//   marks: {
//     bold: props => <strong>{props.children}</strong>,
//     code: props => <code>{props.children}</code>,
//     italic: props => <em>{props.children}</em>,
//     underlined: props => <u>{props.children}</u>,
//   }
// }
// class HoveringMenu extends React.Component {
//   state = {
//     state: Raw.deserialize(initialState, { terse: true })
//   };

//   componentDidMount = () => {
//     this.updateMenu()
//   }

//   componentDidUpdate = () => {
//     this.updateMenu()
//   }

//   // Check if the current selection has a mark with `type` in it.
//   hasMark = (type) => {
//     const { state } = this.state
//     return state.marks.some(mark => mark.type == type)
//   }

//   onChange = (state) => {
//     this.setState({ state })
//   }

//   /**
//    * When a mark button is clicked, toggle the current mark.
//    *
//    * @param {Event} e
//    * @param {String} type
//    */
//   onClickMark = (e, type) => {
//     e.preventDefault()
//     let { state } = this.state

//     state = state
//       .transform()
//       .toggleMark(type)
//       .apply()

//     this.setState({ state })
//   }

//   // When the portal opens, cache the menu element.
//   onOpen = (portal) => {
//     this.setState({ menu: portal.firstChild })
//   }

//   render = () =>
//     <div>
//       {this.renderMenu()}
//       {this.renderEditor()}
//     </div>

//   //Render the hovering menu.
//   renderMenu = () =>
//     <div className="menu hover-menu" onClick={this.onOpen}>
//       {this.renderMarkButton('bold', 'format_bold')}
//       {this.renderMarkButton('italic', 'format_italic')}
//       {this.renderMarkButton('underlined', 'format_underlined')}
//       {this.renderMarkButton('code', 'code')}
//     </div>


//   /**
//    * Render a mark-toggling toolbar button.
//    *
//    * @param {String} type
//    * @param {String} icon
//    * @return {Element}
//    */
//   renderMarkButton = (type, icon) => {
//     const isActive = this.hasMark(type)
//     const onMouseDown = e => this.onClickMark(e, type)

//     return (
//       <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
//         <span className="material-icons">{icon}</span>
//       </span>
//     )
//   }
//   renderEditor = () =>
//     <Editor
//       schema={schema}
//       state={this.state.state}
//       onChange={this.onChange}
//     />

//   // Update the menu's absolute position.
//   updateMenu = () => {
//     const { menu, state } = this.state
//     if (!menu) return

//     if (state.isBlurred || state.isEmpty) {
//       menu.removeAttribute('style')
//       return
//     }

//     const selection = window.getSelection()
//     const range = selection.getRangeAt(0)
//     const rect = range.getBoundingClientRect()
//     menu.style.opacity = 1
//     menu.style.top = `${rect.top + window.scrollY - menu.offsetHeight}px`
//     menu.style.left = `${rect.left + window.scrollX - menu.offsetWidth / 2 + rect.width / 2}px`
//   }

// }