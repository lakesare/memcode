import TogglerAndModal from '~/components/TogglerAndModal';
import api from '~/api';
import Problem from '~/components/Problem';
import Loading from '~/components/Loading';
import switchType from '~/pages/courses_id/components/services/switchType';

import css from './index.scss';

class EditFlashcardModal extends React.Component {
  static propTypes = {
    toggler: PropTypes.element.isRequired,
    problem: PropTypes.object.isRequired,
    onSaved: PropTypes.func
  }

  static defaultProps = {
    onSaved: () => {}
  }

  state = {
    speSave:        {},
    problemType:    this.props.problem.type,
    problemContent: this.props.problem.content,
    uploadsPending: false
  }

  // [claude comment] the modal is mounted once but reused across flashcards, so re-seed from the current problem on every open
  resetFromProblem = () =>
    this.setState({
      speSave:        {},
      problemType:    this.props.problem.type,
      problemContent: this.props.problem.content,
      uploadsPending: false
    })

  updateProblemContent = (problemContent) =>
    this.setState({ problemContent, speSave: {} })

  updateType = (newType) =>
    this.setState({
      problemType:    newType,
      problemContent: switchType(this.state.problemContent, newType)
    })

  onUploadStateChange = (pending) =>
    this.setState({ uploadsPending: pending })

  apiSave = (closeModal) => {
    if (this.state.speSave.status === 'request' || this.state.uploadsPending) return;

    const updatedProblem = {
      ...this.props.problem,
      type:    this.state.problemType,
      content: this.state.problemContent
    };

    api.post.ProblemApi.update(
      (spe) => this.setState({ speSave: spe }),
      { id: this.props.problem.id, problem: updatedProblem }
    )
      .then(() => {
        this.props.onSaved(updatedProblem);
        closeModal();
      });
  }

  renderTypeButton = (type, typeInHuman) =>
    <button
      type="button"
      className={`button -${type} ${this.state.problemType === type ? '-active' : ''}`}
      onClick={() => this.state.problemType !== type && this.updateType(type)}
      tabIndex={-1}
    >{typeInHuman}</button>

  render = () =>
    <TogglerAndModal
      toggler={this.props.toggler}
      afterOpen={this.resetFromProblem}
    >{(closeModal) =>
      <section className={`standard-modal ${css.editFlashcardModal}`}>
        <div className="standard-modal__header">
          <h2 className="standard-modal__title">Edit Flashcard</h2>
        </div>

        <div className="standard-modal__main">
          <Problem
            mode="edit"
            problemContent={this.state.problemContent}
            updateProblemContent={this.updateProblemContent}
            problemType={this.state.problemType}
            onUploadStateChange={this.onUploadStateChange}
          />

          <Loading enabledStatuses={['failure']} spe={this.state.speSave}/>

          <div className="footer">
            <section className="choose-type">
              <div className="buttons">
                {this.renderTypeButton('separateAnswer', 'question-answer')}
                {this.renderTypeButton('inlinedAnswers', 'fill-in answer')}
              </div>
            </section>

            <div className="actions">
              <button
                type="button"
                className="button -white -move-up-on-hover"
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                type="button"
                className="button -orange -move-up-on-hover"
                onClick={() => this.apiSave(closeModal)}
                disabled={this.state.speSave.status === 'request' || this.state.uploadsPending}
              >
                {this.state.uploadsPending ? 'Uploading...' : (this.state.speSave.status === 'request' ? 'Saving...' : 'Save')}
              </button>
            </div>
          </div>
        </div>
      </section>
    }</TogglerAndModal>
}

export default EditFlashcardModal;
