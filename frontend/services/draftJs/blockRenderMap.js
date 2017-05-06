import { DefaultDraftBlockRenderMap } from 'draft-js';
import Immutable from 'immutable';

const blockRenderMap = () =>
  DefaultDraftBlockRenderMap.merge(
    Immutable.Map({
      'code-block': {
        wrapper: <CodeBlock/>
      }
    })
  );

class CodeBlock extends React.Component {
  static propTypes = {
    children: PropTypes.array // content of a code block
  }
  static defaultProps = {
    children: null
  }
  render = () =>
    <pre><code>{this.props.children}</code></pre>
}

export { blockRenderMap };
