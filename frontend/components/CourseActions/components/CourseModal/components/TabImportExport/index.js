import SectionImportFlashcards from './components/SectionImportFlashcards';
import SectionImportFlashcardsFromText from './components/SectionImportFlashcardsFromText';
import SectionExportFlashcards from './components/SectionExportFlashcards';
import css from './index.scss';

class TabImportExport extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired
  }

  render = () =>
    <div className={css.tab}>
      <div className="background -blue">
        <SectionImportFlashcardsFromText courseId={this.props.course.id}/>
        <hr/>
        <SectionImportFlashcards courseId={this.props.course.id}/>
        <hr/>
        <SectionExportFlashcards course={this.props.course}/>
      </div>
    </div>
}

export default TabImportExport;
