import React from 'react';

import Editor from 'draft-js-plugins-editor';

// draftJs
import { DraftJsPlugins } from '~/services/draftJs/plugins';
import { blockRenderMap } from '~/services/draftJs/blockRenderMap';

import { isReadonly } from '../services';

class CommonEditor extends React.Component {
  static propTypes = {
    mode: React.PropTypes.string.isRequired,
    editorState: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
    save: React.PropTypes.func.isRequired,
    placeholder: React.PropTypes.object
  }

  onBlur = () => {
    if (this.props.mode === 'editingOld') {
      this.props.save();
    }
  }

  render = () =>
    <Editor
      editorState={this.props.editorState}
      onChange={this.props.onChange}
      onBlur={this.onBlur}
      plugins={[
        DraftJsPlugins.saveProblem(this.props.save),
        DraftJsPlugins.richText(),
        DraftJsPlugins.pasteImageFromClipboard()
      ]}
      blockRenderMap={blockRenderMap()}
      readOnly={isReadonly(this.props.mode)}
      placeholder={this.props.placeholder}
    />
}

export { CommonEditor };
