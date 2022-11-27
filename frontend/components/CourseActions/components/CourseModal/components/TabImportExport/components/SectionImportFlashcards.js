import readUploadedExcelFile from '~/services/readUploadedExcelFile';
import api from '~/api';

import Loading from '~/components/Loading';

import exampleOfGoodExcelForImport from '../images/exampleOfGoodExcelForImport.png';

class SectionImportFlashcards extends React.Component {
  static propTypes = {
    courseId: PropTypes.number.isRequired,
  }

  state = {
    flashcardsToBeImported: [],
    speImport: {}
  }

  apiImportFlashcards = () =>
    api.ProblemApi.importFromExcel(
      (spe) => this.setState({ speImport: spe }),
      {
        courseId: this.props.courseId,
        problems: this.state.flashcardsToBeImported
      }
    )
      .then(() => {
        this.setState({ flashcardsToBeImported: [] });
      })

  uiSetAndValidateNewFlashcards = (event) => {
    readUploadedExcelFile(event.target.files[0])
      .then((arrayOfHashes) => {
        const flashcardsToBeImported = arrayOfHashes.map((excelRowHash) => {
          const excelRowArray = Object.values(excelRowHash);
          const one = excelRowArray[0];
          const two = excelRowArray[1];
          const type = one.includes('class="answer"') ? 'inlinedAnswers' : 'separateAnswer';

          if (type === 'inlinedAnswers') {
            return {
              type: 'inlinedAnswers',
              content: {
                content: one,
                explanation: two
              }
            };
          } else {
            return {
              type: 'separateAnswer',
              content: {
                content: one,
                answer: two
              }
            };
          }
        });
        this.setState({ flashcardsToBeImported });
      });

    // aand clear the input to enabled reuploads,
    // otherwise input would do nothing onclick
    event.target.value = null;
  }

  renderUploadExcelFileInput = () =>
    <div className="upload-excel-file-input-and-label">
      <input
        style={{ display: 'none' }}
        id="upload-excel-file-input-id"
        type="file"
        onChange={this.uiSetAndValidateNewFlashcards}
      />
      <label htmlFor="upload-excel-file-input-id">
        <i className="fa fa-download"/>
        Upload Excel File
      </label>
    </div>

  renderCreateFlashcardsButton = () => (
    this.state.flashcardsToBeImported.length > 0 ?
      <button
        className="create-flashcards-button button -pink"
        type="button"
        onClick={this.apiImportFlashcards}
      >
        Create {this.state.flashcardsToBeImported.length} flashcards
      </button> :
      <button
        className="create-flashcards-button button -pink -disabled"
        type="button"
      >Create flashcards</button>
  )

  renderInstructions = () =>
    <article className="instructions">
      <div className="first-column">
        <p>
          <b>Create flashcards</b><br/>
          In bulk by uploading them from the excel file. Useful for importing courses created by you from other sites.
        </p>
        <p>
          <b>Format expected</b><br/>
          First column for the questions, second column for the answers. HTML is welcome.
        </p>
        <p>
          <b>A type of a flashcard</b><br/>
          The type of the flashcard is "Question-Answer" by default, and "Fill-In Answer" if the first-column cell contains "<b>{'<mark class="answer">hi</mark>'}</b>".
        </p>
      </div>

      <div className="second-column">
        <figure>
          <figcaption><b>Example of a valid excel file</b></figcaption>
          <img src={exampleOfGoodExcelForImport} alt=""/>
        </figure>
      </div>
    </article>

  render = () =>
    <section className="import-flashcards">
      <h2 className="title">Import flashcards from the Excel file</h2>

      {this.renderInstructions()}

      {this.renderUploadExcelFileInput()}
      {this.renderCreateFlashcardsButton()}

      <Loading spe={this.state.speImport}>{({ amountOfCreatedProblems }) =>
        <div className="standard-success-message">
          Success! <b>{amountOfCreatedProblems} flashcards</b> have been <b>created</b>, please reload the page and rejoice!
        </div>
      }</Loading>

    </section>
}

export default SectionImportFlashcards;
