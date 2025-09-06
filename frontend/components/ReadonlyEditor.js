import AudioButton from '~/components/AudioButton';

class ReadonlyEditor extends React.Component {
  static propTypes = {
    html: PropTypes.string.isRequired,
    className: PropTypes.string,
    audioText: PropTypes.string
  }

  static defaultProps = {
    className: '',
    audioText: null
  }

  render = () =>
    <div className={`quill -readOnly ${this.props.className} ${!this.props.html ? '-empty' : ''} ${this.props.audioText ? '-with-audio' : ''}`}>
      <div className="ql-container ql-snow">
        <div className="ql-editor" dangerouslySetInnerHTML={{ __html: this.props.html }}/>
      </div>
      {this.props.audioText && (
        <AudioButton 
          text={this.props.audioText}
          className="readonly-editor-audio-btn"
        />
      )}
    </div>
}

export { ReadonlyEditor };
export default ReadonlyEditor;
