import SectionImportFlashcards from './components/SectionImportFlashcards';
import SectionExportFlashcards from './components/SectionExportFlashcards';
import css from './index.css';

class TabImportExport extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired
  }

  render = () =>
    <div className={css.tab}>
      <div className="background -blue">
        <SectionImportFlashcards courseId={this.props.course.id}/>
        <hr/>
        <SectionExportFlashcards course={this.props.course}/>
      </div>
    </div>
}

export default TabImportExport;
