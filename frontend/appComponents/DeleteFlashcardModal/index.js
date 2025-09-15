import TogglerAndModal from '~/components/TogglerAndModal';
import api from '~/api';

class DeleteFlashcardModal extends React.Component {
  static propTypes = {
    toggler: PropTypes.element.isRequired,
    problemIds: PropTypes.array.isRequired,
    onDelete: PropTypes.func, // Optional callback after successful deletion
    onCancel: PropTypes.func  // Optional callback when cancelled
  }

  static defaultProps = {
    onDelete: () => {},
    onCancel: () => {}
  }

  state = {
    speDelete: {}
  }

  apiDeleteProblems = (closeModal) => {
    if (this.state.speDelete.status === 'request') return;
    
    api.post.ProblemApi.deleteMany(
      (spe) => this.setState({ speDelete: spe }),
      { ids: this.props.problemIds }
    )
      .then(() => {
        closeModal();
        this.props.onDelete();
      })
      .catch((error) => {
        console.error('Error deleting problems:', error);
        this.setState({ speDelete: { status: 'error', error } });
      });
  }

  getTitle = () => {
    const count = this.props.problemIds.length;
    return count === 1 ? 'Delete Flashcard' : `Delete ${count} Flashcards`;
  }

  getDescription = () => {
    const count = this.props.problemIds.length;
    if (count === 1) {
      return 'Are you sure you want to permanently delete this flashcard?';
    }
    return `Are you sure you want to permanently delete ${count} flashcards?`;
  }

  render = () =>
    <TogglerAndModal 
      toggler={this.props.toggler}
      afterClose={this.props.onCancel}
    >{(closeModal) =>
      <section className="standard-modal standard-modal--sm">
        <div className="standard-modal__header">
          <h2 className="standard-modal__title">{this.getTitle()}</h2>
        </div>

        <div className="standard-modal__main">
          <p>{this.getDescription()}</p>
          <p>This action cannot be undone.</p>

          <div style={{ display: 'flex', gap: '20px', marginTop: '50px', justifyContent: "space-between" }}>
            <button
              type="button"
              className="button -red -move-up-on-hover"
              onClick={() => this.apiDeleteProblems(closeModal)}
              disabled={this.state.speDelete.status === 'request'}
            >
              {this.state.speDelete.status === 'request' ? 'Deleting...' : 'Delete'}
            </button>
            
            <button
              type="button"
              className="button -white -move-up-on-hover"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>

          {this.state.speDelete.status === 'error' && (
            <div style={{ color: 'red', marginTop: '10px' }}>
              Error deleting flashcard(s). Please try again.
            </div>
          )}
        </div>
      </section>
    }</TogglerAndModal>
}

export default DeleteFlashcardModal;