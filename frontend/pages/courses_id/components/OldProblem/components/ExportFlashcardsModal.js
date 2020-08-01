import Select from '~/components/Select';

import TogglerAndModal from '~/components/TogglerAndModal';
import api from '~/api';

class ExportFlashcardsModal extends React.Component {
  static propTypes = {
    toggler: PropTypes.element.isRequired,
    uiRemoveOldProblems: PropTypes.func.isRequired,
    idsOfCheckedProblems: PropTypes.array.isRequired,
    createdCoursesForSelect: PropTypes.array.isRequired
  }

  state = {
    speExport: {},
    courseId: null
  }

  apiMove = (closeModal) => {
    const ids = this.props.idsOfCheckedProblems;
    closeModal()
      .then(() => {
        this.props.uiRemoveOldProblems(ids);
      });
    api.ProblemApi.moveToCourseMany(
      (spe) => this.setState({ speExport: spe }),
      {
        problemIds: this.props.idsOfCheckedProblems,
        courseId: this.state.courseId
      }
    );
  }

  renderSelect = () =>
    <Select
      placeholder="Choose Course"
      options={this.props.createdCoursesForSelect}
      value={this.state.courseId}
      updateValue={(courseId) => this.setState({ courseId })}
    />

  render = () =>
    <TogglerAndModal toggler={this.props.toggler}>{(closeModal) =>
      <section className={"standard-modal standard-modal--md "}>
        <div className="standard-modal__header">
          <h2 className="standard-modal__title">Export {this.props.idsOfCheckedProblems.length} Flashcards</h2>
        </div>

        <div className="standard-modal__main">
          <p>Would you like to move all selected flashcards to another course?<br/><br/></p>

          {this.renderSelect()}

          <button
            type="button"
            className="button -orange standard-submit-button -move-up-on-hover"
            onClick={() => this.apiMove(closeModal)}
            disabled={!this.state.courseId}
          >
            Move <i style={{ paddingLeft: 6 }} className="fa fa-exchange"/>
          </button>
        </div>
      </section>
    }</TogglerAndModal>
}

export default ExportFlashcardsModal;
