import { Raw } from 'slate';
import { SlateEditor } from '~/components/SlateEditor';

const initialState = {
  nodes: [
    {
      kind: 'block',
      type: 'paragraph',
      nodes: [
        // {
        //   kind: 'inline',
        //   type: 'answer',
        //   data: { answer: 'hi!' },
        //   nodes: [
        //     {
        //       kind: 'text',
        //       text: ' '
        //     }
        //   ]
        // },
        {
          kind: 'text',
          ranges: [
            {

              text: 'hello'
            },
            {
              "text": "rich",
              "marks": [
                {
                  "type": "bold"
                }
              ]
            },
          ],


        },
        
      ]
    }
  ]
};

class Slate extends React.Component {

  state = {
    editorState: Raw.deserialize(initialState, { terse: true })
  }

  render = () =>
    <div>
      <SlateEditor
        editorState={this.state.editorState}
        updateEditorState={(editorState) => this.setState({ editorState })}
      />
      
    </div>
}

export { Slate };
