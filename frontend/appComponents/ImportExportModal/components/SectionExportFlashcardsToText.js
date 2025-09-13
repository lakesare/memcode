import api from '~/api';
import disableOnSpeRequest from '~/services/disableOnSpeRequest';

import Loading from '~/components/Loading';

// Export flashcards to the same text format used for text imports
class SectionExportFlashcardsToText extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
  }

  state = {
    speGetFlashcards: {},
    exportedText: '',
    isExported: false,
    textCopied: false
  }

  apiExportFlashcards = () =>
    api.post.ProblemApi.exportToExcel(
      (spe) => this.setState({ speGetFlashcards: spe }),
      { courseId: this.props.course.id }
    )
      .then((flashcards) => {
        const textLines = flashcards.map((flashcard) => {
          if (flashcard.type === 'inlinedAnswers') {
            return `cloze-deletion ||| ${flashcard.content.content} ||| ${flashcard.content.explanation || ''}`;
          } else if (flashcard.type === 'separateAnswer') {
            return `question-answer ||| ${flashcard.content.content} ||| ${flashcard.content.answer || ''}`;
          }
          return '';
        }).filter(line => line); // Remove empty lines

        const exportedText = textLines.join('\n');
        this.setState({ exportedText, isExported: true });
      })

  copyTextToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(this.state.exportedText);
      this.setState({ textCopied: true });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        this.setState({ textCopied: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text to clipboard:', err);
    }
  }

  downloadTextFile = () => {
    const blob = new Blob([this.state.exportedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Memcode - ${this.props.course.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  render = () =>
    <section className="export-flashcards">
      <h2 className="title">Export flashcards to text</h2>

      <button
        className="create-flashcards-button button -pink"
        type="button"
        onClick={this.apiExportFlashcards}
        style={disableOnSpeRequest(this.state.speGetFlashcards)}
      >
        Export flashcards to text
      </button>

      <Loading spe={this.state.speGetFlashcards}>{(flashcards) => {
        if (!this.state.isExported) return null;
        
        return (
          <div>
            <div className="standard-success-message">
              Success! <b>{flashcards.length} flashcards</b> have been <b>exported to text format</b>.
            </div>
            
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <button
                  className="button -blue"
                  type="button"
                  onClick={this.copyTextToClipboard}
                  style={{
                    backgroundColor: this.state.textCopied ? '#4caf50' : undefined
                  }}
                >
                  {this.state.textCopied ? '✓ Copied!' : 'Copy to clipboard'}
                </button>
                <button
                  className="button -blue"
                  type="button"
                  onClick={this.downloadTextFile}
                >
                  Download as file
                </button>
              </div>
              
              <textarea
                value={this.state.exportedText}
                readOnly
                style={{
                  width: '100%',
                  height: '200px',
                  backgroundColor: '#ffffff3d',
                  borderRadius: '4px',
                  padding: '10px',
                  whiteSpace: 'nowrap',
                  lineHeight: '22px',
                  resize: 'vertical',
                  fontFamily: 'monospace',
                  fontSize: '12px'
                }}
              />
            </div>
          </div>
        );
      }}</Loading>
    </section>
}

export default SectionExportFlashcardsToText;