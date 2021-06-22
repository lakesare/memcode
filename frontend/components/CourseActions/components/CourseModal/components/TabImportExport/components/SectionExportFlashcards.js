import createAndDownloadExcelFile from '~/services/createAndDownloadExcelFile';
import api from '~/api';
import disableOnSpeRequest from '~/services/disableOnSpeRequest';

import Loading from '~/components/Loading';

// 1. ApiGet all flashcards for this course
// 2. Turn them into excel
class SectionExportFlahscards extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
  }

  state = {
    speGetFlashcards: {}
  }

  apiExportFlashcards = () =>
    api.ProblemApi.exportToExcel(
      (spe) => this.setState({ speGetFlashcards: spe }),
      { courseId: this.props.course.id }
    )
      .then((flashcards) => {
        const arrayOfHashes = flashcards.map((flashcard) => {
          if (flashcard.type === 'inlinedAnswers') {
            return {
              Question: flashcard.content.content,
              Answer:   flashcard.content.explanation
            };
          } else if (flashcard.type === 'separateAnswer') {
            return {
              Question: flashcard.content.content,
              Answer:   flashcard.content.answer
            };
          }
        });
        createAndDownloadExcelFile(arrayOfHashes, `Memcode - ${this.props.course.title}.xlsx`, this.props.course.title);
      })

  render = () =>
    <section className="export-flashcards">
      <h2 className="title">Export flashcards to the Excel file</h2>

      <button
        className="create-flashcards-button button -pink"
        type="button"
        onClick={this.apiExportFlashcards}
        style={disableOnSpeRequest(this.state.speGetFlashcards)}
      >
        Export flashcards
      </button>

      <Loading spe={this.state.speGetFlashcards}>{(flashcards) =>
        <div className="standard-success-message">
          Success! <b>{flashcards.length} flashcards</b> have been <b>put into excel</b>, please see the downloaded file.
        </div>
      }</Loading>
    </section>
}

export default SectionExportFlahscards;
