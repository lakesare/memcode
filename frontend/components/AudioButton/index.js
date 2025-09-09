import TtsService from '~/services/ttsService';
import css from './index.scss';

class AudioButton extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    className: PropTypes.string
  }

  static defaultProps = {
    className: ''
  }

  state = {
    isLoading: false
  }

  handleClick = async () => {
    if (this.state.isLoading) return;
    
    try {
      // Check if it's cached (async)
      const isCached = await TtsService.isCached(this.props.text);
      
      if (!isCached) {
        // Not cached - show loading indicator for API call
        this.setState({ isLoading: true });
      }
      
      // Play audio (from cache or API)
      await TtsService.speakText(this.props.text);

      // Reset loading state
      this.setState({ isLoading: false });
      
    } catch (error) {
      console.error('Error playing audio:', error);
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { isLoading } = this.state;
    const { className } = this.props;

    return (
      <button
        className={`audio-button ${css.audioButton} ${className} ${isLoading ? '-is-loading' : ''}`}
        onClick={this.handleClick}
        type="button"
        disabled={isLoading}
      >
        {isLoading ? <i className="fa fa-spinner fa-spin"/> : <i className="material-icons -yes">volume_up</i>}
      </button>
    );
  }
}

export default AudioButton;
