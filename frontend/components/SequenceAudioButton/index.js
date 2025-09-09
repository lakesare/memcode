import TtsService from '~/services/ttsService';
import css from '../AudioButton/index.scss';

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
      // Check cache and show loading indicator if needed
      let showLoading = false;
      
      if (this.props.playFullText) {
        // For succumb sequence, check if it's cached
        const isCachedAnywhere = await TtsService.isCached(this.props.content);
        
        if (!isCachedAnywhere) {
          showLoading = true;
        }
      } else {
        // For sequence playback, check if any of the text parts need to be fetched
        // This gives better UX by showing loading when parts aren't cached
        const textParts = TtsService.splitIntoTextParts(this.props.content);
        const answers = TtsService.getAnswerTexts(this.props.content);
        
        // Check if any non-answer parts need to be fetched
        for (const part of textParts) {
          const isAnswer = answers.includes(part);
          if (!isAnswer) {
            const cleanText = TtsService.prepareTextForTts(part);
            if (cleanText) {
              const isCached = await TtsService.isCached(cleanText);
              if (!isCached) {
                showLoading = true;
                break;
              }
            }
          }
        }
      }
      
      if (showLoading) {
        this.setState({ isLoading: true });
      }
      
      // Play audio
      if (this.props.playFullText) {
        // Play succumb sequence (handles both single and multi-cloze)
        await TtsService.playSuccumbSequence(this.props.content);
      } else {
        // Play normal sequence with noise for unanswered parts
        await TtsService.playSequence(this.props.content, this.props.answerInputs);
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
