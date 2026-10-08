import Select from '~/components/Select';
import Loading from '~/components/Loading';

import TogglerAndModal from '~/components/TogglerAndModal';
import offlineApi from '~/services/offline/offlineApi';

class ExportFlashcardsModal extends React.Component {
  static propTypes = {
    toggler: PropTypes.element.isRequired,
    courseId: PropTypes.number.isRequired,
    uiRemoveOldProblems: PropTypes.func.isRequired,
    idsOfCheckedProblems: PropTypes.array.isRequired,
    createdCoursesForSelect: PropTypes.array.isRequired
  }

  state = {
    speExport: {},
    courseId: null
  }

  apiMove = (closeModal) => {
    if (!this.state.courseId || this.state.speExport.status === 'request') return;
    const ids = this.props.idsOfCheckedProblems;
    offlineApi.ProblemApi.moveToCourseMany(
      (spe) => this.setState({ speExport: spe }),
      {
        problemIds: ids,
        courseId: this.state.courseId
      },
      { courseId: this.props.courseId }
    )
      .then(() => {
        closeModal();
        this.props.uiRemoveOldProblems(ids);
      })
      .catch(() => {});
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
      <section className={"standard-modal standard-modal--sm"}>
        <div className="standard-modal__header">
          <h2 className="standard-modal__title">Export {this.props.idsOfCheckedProblems.length} Flashcards</h2>
        </div>

        <div className="standard-modal__main">
          <p>Would you like to move all selected flashcards to another course?<br/><br/></p>

          {this.renderSelect()}

          <Loading enabledStatuses={['failure']} spe={this.state.speExport}/>

          <button
            type="button"
            className={`button -orange standard-submit-button -move-up-on-hover ${this.state.courseId ? '' : '-disabled'}`}
            onClick={() => this.apiMove(closeModal)}
            disabled={this.state.speExport.status === 'request'}
          >
            Move <i style={{ paddingLeft: 6 }} className="fa fa-exchange"/>
          </button>
        </div>
      </section>
    }</TogglerAndModal>
}

export default ExportFlashcardsModal;
