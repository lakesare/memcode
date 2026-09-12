import api from '~/api';
import disableOnSpeRequest from '~/services/disableOnSpeRequest';

import TogglerAndModal from '~/components/TogglerAndModal';

import css from './index.scss';

class MakeAllDueModal extends React.Component {
  static propTypes = {
    toggler: PropTypes.element.isRequired,
    courseUserIsLearning: PropTypes.object.isRequired,
    MyActions: PropTypes.object.isRequired
  }

  state = {
    speMakeAllProblemsDue: {}
  }

  apiMakeAllProblemsDue = (closeModal) =>
    api.post.CourseUserIsLearningApi.makeAllProblemsDue(
      (speMakeAllProblemsDue) => this.setState({ speMakeAllProblemsDue }),
      { id: this.props.courseUserIsLearning.id }
    )
      .then(() => {
        this.props.MyActions.apiGetCourses();
        closeModal();
      })

  render = () =>
    <TogglerAndModal toggler={this.props.toggler}>{(closeModal) =>
      <section className={`standard-modal standard-modal--sm ${css.modal}`}>
        <div className="standard-modal__header">
          <h2 className="standard-modal__title">Make all flashcards due</h2>
        </div>

        <div className="standard-modal__main">
          <div className="standard-modal__description">
            Every flashcard of this course goes back into the review pile right now.
          </div>

          <section className="buttons">
            <button type="button" className="button -white" onClick={closeModal}>
              Cancel
            </button>
            <button
              type="button"
              className="button -purple"
              style={disableOnSpeRequest(this.state.speMakeAllProblemsDue)}
              onClick={() => this.apiMakeAllProblemsDue(closeModal)}
            >
              Make all due
            </button>
          </section>
        </div>
      </section>
    }</TogglerAndModal>
}

export default MakeAllDueModal;
