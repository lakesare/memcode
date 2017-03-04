import React from 'react';

import { contentObjectToString } from '~/services/contentObjectToString';
import { contentStringToJsx } from '~/services/contentStringToJsx';

import Editor from 'draft-js-plugins-editor';
import {
  EditorState, convertFromHTML, ContentState,
} from 'draft-js';

import { draftJsKeyBindingPlugin } from './draftJsKeyBindingPlugin';


class Problem extends React.Component {
  static propTypes = {
    problem: React.PropTypes.object.isRequired,
    index:   React.PropTypes.number.isRequired, // just for pretiness, to number down the problems
  }

  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML(this.props.problem.explanation || '')
        )
      )
    };
  }

  renderContent = () => {
    const content = this.props.problem.content;
    const jsx = contentStringToJsx(
      contentObjectToString(content.text),
      answerIndex => <input className="answer success" type="text" readOnly value={content.answers[answerIndex]}/>
    );
    return jsx;
  }

  render = () =>
    <section className="problem row">
      <div className="index">{this.props.index}</div>

      <div className="content col-6">
        {this.renderContent()}
      </div>

      <Editor
        editorState={this.state.editorState}
        onChange={newState => this.setState({ editorState: newState })}
        plugins={[draftJsKeyBindingPlugin]}
      />

      <div className="actions">
        <i className="fa fa-trash-o"/>
      </div>
    </section>
}

export { Problem };

