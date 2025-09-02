import TogglerAndModal from '~/components/TogglerAndModal';
import TabImportExport from '../CourseModal/components/TabImportExport';

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
          <TabImportExport
            course={this.props.course}
            MyActions={this.props.MyActions}
            onProblemsImported={this.props.onProblemsImported}
            closeModal={closeModal}
          />
        </div>
      </section>
    }</TogglerAndModal>
}

export default ImportExportModal;
