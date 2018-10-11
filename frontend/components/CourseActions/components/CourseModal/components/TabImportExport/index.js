import SectionImportFlashcards from './components/SectionImportFlashcards';
import SectionExportFlashcards from './components/SectionExportFlashcards';
import css from './index.css';

class TabImportExport extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
    tabNavigation: PropTypes.element.isRequired
  }

  render = () =>
    <section className={"standard-white-heading_and_blue-content " + css.tab}>
      <div className="background -white">
        <h2 className="title">Edit Course</h2>
        {this.props.tabNavigation}
      </div>

      <div className="background -blue">
        <form className="standard-form">
          <SectionImportFlashcards courseId={this.props.course.id}/>
          <SectionExportFlashcards course={this.props.course}/>
        </form>
      </div>
    </section>
}

export default TabImportExport;
