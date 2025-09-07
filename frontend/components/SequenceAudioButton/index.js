import SequenceTtsService from '~/services/SequenceTtsService';
import ClozeDeletion from '~/services/ClozeDeletion';
import css from '../AudioButton/index.scss'; // Reuse existing styles

class SequenceAudioButton extends React.Component {
  static propTypes = {
    content: PropTypes.string.isRequired, // HTML content with cloze deletions
    answerInputs: PropTypes.array, // Array of input elements, null for auto-play behavior
    playFullText: PropTypes.bool, // If true, play full text instead of sequence
    className: PropTypes.string
  }

  static defaultProps = {
    className: '',
    answerInputs: null,
    playFullText: false
  }

  state = {
    isLoading: false
  }

  handleClick = async () => {
    if (this.state.isLoading) return;
    
    try {
      let isInMemoryCache = false;
      
      if (this.props.playFullText) {
        // Check if full text is in memory cache
        const cleanText = ClozeDeletion.stripHtmlTags(this.props.content);
        isInMemoryCache = SequenceTtsService.isFullTextCached && await SequenceTtsService.isFullTextCached(this.props.content);
      } else {
        // Check if sequence parts are in memory cache  
        isInMemoryCache = await SequenceTtsService.isSequenceCached(this.props.content);
      }
      
      if (!isInMemoryCache) {
        // Not cached - show loading indicator
        this.setState({ isLoading: true });
      }
      
      // Play audio
      console.log('SequenceAudioButton: playFullText =', this.props.playFullText);
      console.log('SequenceAudioButton: answerInputs =', this.props.answerInputs);
      
      if (this.props.playFullText) {
        console.log('🎯 Taking succumb sequence path!');
        // Experimental: Play succumb sequence (word + word + word + full sentence)
        await SequenceTtsService.playSuccumbSequence(this.props.content);
      } else {
        console.log('🎯 Taking normal sequence path!');
        await SequenceTtsService.playSequence(this.props.content, this.props.answerInputs);
      }

      // Reset loading state
      this.setState({ isLoading: false });
      
    } catch (error) {
      console.error('Error playing sequence audio:', error);
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

export default SequenceAudioButton;
