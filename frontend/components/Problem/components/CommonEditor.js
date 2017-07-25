import Editor from 'draft-js-plugins-editor';

// draftJs
import { DraftJsPlugins } from '~/services/draftJs/plugins';
import { blockRenderMap } from '~/services/draftJs/blockRenderMap';
import { customStyleMap } from '~/services/draftJs/customStyleMap';

import { isReadonly } from '../services';

class CommonEditor extends React.Component {
  static propTypes = {
    mode: PropTypes.string.isRequired,
    editorState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.object
  }

  render = () =>
    <Editor
      editorState={this.props.editorState}
      onChange={this.props.onChange}
      plugins={[
        DraftJsPlugins.richText(),
        DraftJsPlugins.pasteImageFromClipboard()
      ]}
      blockRenderMap={blockRenderMap()}
      readOnly={isReadonly(this.props.mode)}
      placeholder={isReadonly(this.props.mode) ? null : this.props.placeholder}
      customStyleMap={customStyleMap}
    />
}

export { CommonEditor };
