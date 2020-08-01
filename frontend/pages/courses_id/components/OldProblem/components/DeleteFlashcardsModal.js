import TogglerAndModal from '~/components/TogglerAndModal';
import api from '~/api';

class DeleteFlashcardsModal extends React.Component {
  static propTypes = {
    toggler: PropTypes.element.isRequired,
    uiRemoveOldProblems: PropTypes.func.isRequired,
    idsOfCheckedProblems: PropTypes.array.isRequired
  }

  apiDeleteAllCheckedProblems = (closeModal) => {
    const ids = this.props.idsOfCheckedProblems;
    closeModal()
      .then(() => {
        this.props.uiRemoveOldProblems(ids);
      });
    api.ProblemApi.deleteMany(false, { ids });
  }

  render = () =>
    <TogglerAndModal toggler={this.props.toggler}>{(closeModal) =>
      <section className={"standard-modal standard-modal--md "}>
        <div className="standard-modal__header">
          <h2 className="standard-modal__title">Delete {this.props.idsOfCheckedProblems.length} Flashcards</h2>
        </div>

        <div className="standard-modal__main">
          <p>Would you like to delete all selected flashcards?</p>

          <button
            type="button"
            className="button -red standard-submit-button -move-up-on-hover"
            onClick={() => this.apiDeleteAllCheckedProblems(closeModal)}
          >
            Delete
          </button>
        </div>
      </section>
    }</TogglerAndModal>
}

export default DeleteFlashcardsModal;
