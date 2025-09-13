import SectionImportFlashcardsFromText from './SectionImportFlashcardsFromText';
import SectionExportFlashcardsToText from './SectionExportFlashcardsToText';

class TabText extends React.Component {
  static propTypes = {
    courseId: PropTypes.number.isRequired,
    course: PropTypes.object.isRequired,
    MyActions: PropTypes.object.isRequired,
    onProblemsImported: PropTypes.func,
    closeModal: PropTypes.func
  }

  render = () =>
    <div className="tab-text">
      <SectionImportFlashcardsFromText 
        courseId={this.props.courseId}
        MyActions={this.props.MyActions}
        onProblemsImported={this.props.onProblemsImported}
        closeModal={this.props.closeModal}
      />
      <hr/>
      <SectionExportFlashcardsToText course={this.props.course}/>
    </div>
}

export default TabText;