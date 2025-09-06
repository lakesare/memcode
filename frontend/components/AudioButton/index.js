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
      // Quick check if it's in memory cache (synchronous)
      const isInMemoryCache = TtsService.isInMemoryCache(this.props.text);
      
      if (isInMemoryCache) {
        // In memory cache - play immediately without loading state
        await TtsService.speakText(this.props.text);
        return;
      }
      
      // Not in memory - check if it's cached anywhere (async)
      // This will also initialize TTS service if needed
      const isCachedAnywhere = await TtsService.isCached(this.props.text);
      
      if (!isCachedAnywhere) {
        // Not cached anywhere - show loading indicator for API call
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
