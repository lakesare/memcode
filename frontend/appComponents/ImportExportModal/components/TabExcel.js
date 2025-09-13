import SectionImportFlashcards from './SectionImportFlashcards';
import SectionExportFlashcards from './SectionExportFlashcards';

class TabExcel extends React.Component {
  static propTypes = {
    courseId: PropTypes.number.isRequired,
    course: PropTypes.object.isRequired
  }

  render = () =>
    <div className="tab-excel">
      <SectionImportFlashcards courseId={this.props.courseId}/>
      <hr/>
      <SectionExportFlashcards course={this.props.course}/>
    </div>
}

export default TabExcel;