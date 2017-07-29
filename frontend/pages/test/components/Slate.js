import { Raw } from 'slate';
import { Editor } from '~/components/Editor';


class Slate extends React.Component {

  state = {
    editorState: Raw.deserialize(initialState, { terse: true })
  }

  render = () =>
    <div>
      <Editor
        editorState={this.state.editorState}
        updateEditorState={(editorState) => this.setState({ editorState })}
      />
    </div>
}

export { Slate };
