import api from '~/api';

import TogglerAndModal from '~/components/TogglerAndModal';
import Select from '~/components/Select';

import css from './index.scss';

const DEFAULT_REPEAT_EVERY_HOURS = 24;

// [claude comment] how *this* user learns *this* course - unlike <SettingsModal/>, nothing here is global
class LearningSettingsModal extends React.Component {
  static propTypes = {
    toggler: PropTypes.element.isRequired,
    courseUserIsLearning: PropTypes.object.isRequired,
    MyActions: PropTypes.object.isRequired
  }

  state = {
    formState: this.formStateFromProps(),
    validationError: null
  }

  // [claude comment] repeatEveryHours is null in spaced repetition, so the mode gets its own form field
  formStateFromProps() {
    return {
      repeatMode: this.props.courseUserIsLearning.repeatEveryHours ? 'fixed' : 'sm2',
      repeatEveryHours: this.props.courseUserIsLearning.repeatEveryHours || DEFAULT_REPEAT_EVERY_HOURS
    };
  }

  savedMode = () =>
    this.props.courseUserIsLearning.repeatEveryHours ? 'fixed' : 'sm2'

  ifProgressWillBeReset = () =>
    this.state.formState.repeatMode !== this.savedMode()

  isDirty = () => {
    const saved = this.formStateFromProps();
    const { repeatMode, repeatEveryHours } = this.state.formState;
    if (repeatMode !== saved.repeatMode) return true;

    return repeatMode === 'fixed' && String(repeatEveryHours) !== String(saved.repeatEveryHours);
  }

  updateFormState = (formState) =>
    this.setState({ formState, validationError: null })

  handleSave = (closeModal) => {
    const formState = this.state.formState;

    if (formState.repeatMode === 'fixed') {
      const hours = String(formState.repeatEveryHours).trim();
      if (!/^\d+$/.test(hours) || Number.parseInt(hours, 10) < 1) {
        this.setState({ validationError: 'Please enter a whole number of hours, at least 1.' });
        return;
      }
    }

    api.post.CourseUserIsLearningApi.updateRepeatSchedule(
      false,
      {
        id: this.props.courseUserIsLearning.id,
        repeatEveryHours: formState.repeatMode === 'fixed' ? formState.repeatEveryHours : null
      }
    )
      .then((payload) => {
        this.props.MyActions.updateCourseUserIsLearning(payload.courseUserIsLearning);
        // [claude comment] a reset unlearns every flashcard, so the cached problems are stale
        if (payload.ifProgressWasReset) this.props.MyActions.apiGetCourses();
        closeModal();
      });
  }

  handleCancel = (closeModal) => {
    this.setState({ formState: this.formStateFromProps(), validationError: null });
    closeModal();
  }

  renderSettingsTab = (closeModal) =>
    <div className="settings-tab">
      <section className="part-of-the-website">
        <h2 className="title">This course only</h2>

        <div className="settings">
          <div className="setting">
            <div className="comment">
              Review schedule
            </div>
            <Select
              value={this.state.formState.repeatMode}
              updateValue={(val) => this.updateFormState({ ...this.state.formState, repeatMode: val })}
              options={[
                { value: 'sm2', label: 'Spaced repetition' },
                { value: 'fixed', label: 'Fixed interval' },
              ]}
            />
          </div>

          {
            this.state.formState.repeatMode === 'fixed' &&
            <div className="setting">
              <div className="comment">
                Hours between repetitions
              </div>
              <input
                className="hours-input"
                type="number"
                min="1"
                value={this.state.formState.repeatEveryHours}
                onChange={(event) =>
                  this.updateFormState({ ...this.state.formState, repeatEveryHours: event.target.value })
                }
              />
            </div>
          }
        </div>

        {
          this.state.validationError &&
          <div className="validation-error">{this.state.validationError}</div>
        }

        {
          this.ifProgressWillBeReset() &&
          <div className="reset-warning">
            Switching schedules unlearns every flashcard of this course - you'll go
            through them from scratch. This can't be undone.
          </div>
        }
      </section>

      <section className="buttons">
        <button
          type="button"
          className="button -white"
          onClick={() => this.handleCancel(closeModal)}
        >
          Cancel
        </button>
        <button
          type="button"
          className={`button -purple ${this.isDirty() ? '' : '-disabled'}`}
          disabled={!this.isDirty()}
          onClick={() => this.handleSave(closeModal)}
        >
          Save
        </button>
      </section>
    </div>

  render = () =>
    <TogglerAndModal toggler={this.props.toggler}>{(closeModal) =>
      <section className={`standard-modal ${css.local}`}>
        <div className="standard-modal__header">
          <h2 className="standard-modal__title">Learning Settings</h2>
        </div>

        <div className="standard-modal__main">
          {this.renderSettingsTab(closeModal)}
        </div>
      </section>
    }</TogglerAndModal>
}

export default LearningSettingsModal;
