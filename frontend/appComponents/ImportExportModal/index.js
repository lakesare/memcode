import TogglerAndModal from '~/components/TogglerAndModal';
import SectionImportFlashcards from './components/SectionImportFlashcards';
import SectionImportFlashcardsFromText from './components/SectionImportFlashcardsFromText';
import SectionExportFlashcards from './components/SectionExportFlashcards';
import css from './index.scss';

class ImportExportModal extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
    toggler: PropTypes.element.isRequired,
    MyActions: PropTypes.object.isRequired,
    onProblemsImported: PropTypes.func
  }

  render = () =>
    <TogglerAndModal toggler={this.props.toggler}>{(closeModal) =>
      <section className="standard-modal standard-modal--md">
        <div className="standard-modal__header">
          <h2 className="standard-modal__title">Import/Export Flashcards</h2>
        </div>

        <div className="standard-modal__main">
          <div className={css.modal}>
            <div className="background -blue">
              <SectionImportFlashcardsFromText 
                courseId={this.props.course.id} 
                MyActions={this.props.MyActions} 
                onProblemsImported={this.props.onProblemsImported} 
                closeModal={closeModal}
              />
              <hr/>
              <SectionImportFlashcards courseId={this.props.course.id}/>
              <hr/>
              <SectionExportFlashcards course={this.props.course}/>
            </div>
          </div>
        </div>
      </section>
    }</TogglerAndModal>
}

export default ImportExportModal;
