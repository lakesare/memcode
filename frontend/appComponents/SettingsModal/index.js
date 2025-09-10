import TogglerAndModal from '~/components/TogglerAndModal';
import TabNavigation   from '~/components/TabNavigation';
import { AuthenticationActions } from '~/reducers/Authentication';
import MyDuck from '~/ducks/MyDuck';
import SettingsDuck from '~/ducks/SettingsDuck';
import Select from '~/components/Select';

import css from './index.scss';

@connect(
  (state) => ({
    currentUser: state.global.Authentication.currentUser || false,
    My: state.global.My,
    Settings: state.global.Settings
  }),
  (dispatch) => ({
    signOut: () => AuthenticationActions.signOut(dispatch),
    MyActions: dispatch(MyDuck.getActions),
    SettingsActions: SettingsDuck.getActions(dispatch)
  })
)
class SettingsModal extends React.Component {
  static propTypes = {
    toggler: PropTypes.element.isRequired,
    My: PropTypes.object.isRequired,
    Settings: PropTypes.object.isRequired,
    MyActions: PropTypes.object.isRequired,
    SettingsActions: PropTypes.object.isRequired,
    signOut: PropTypes.func.isRequired,
  }

  state = {
    selectedTab: 'Design',
    formState: {
      hideSocialButtons: false,
      clozeDeletionMode: 'typing',
      flashcardOrder: true,
      ifMonospace: false,
    }
  }

  componentDidMount = () => {
    this.resetFormStateFromProps();
  }

  resetFormStateFromProps = () => {
    this.setState({
      formState: {
        hideSocialButtons: this.props.Settings.hideSocialButtons,
        clozeDeletionMode: this.props.Settings.clozeDeletionMode,
        flashcardOrder: this.props.Settings.flashcardOrder,
        ifMonospace: this.props.Settings.ifMonospace,
      }
    });
  }

  updateFormState = (formState) => {
    this.setState({ formState });
  }

  isDirty = () => {
    const { formState } = this.state;
    const { Settings } = this.props;
    return (
      formState.hideSocialButtons !== Settings.hideSocialButtons ||
      formState.clozeDeletionMode !== Settings.clozeDeletionMode ||
      formState.flashcardOrder !== Settings.flashcardOrder ||
      formState.ifMonospace !== Settings.ifMonospace
    );
  }

  handleSave = (closeModal) => {
    const { formState } = this.state;
    const { Settings } = this.props;
    
    // Only update settings that have changed
    Object.keys(formState).forEach((key) => {
      if (formState[key] !== Settings[key]) {
        this.props.SettingsActions.updateSetting(key, formState[key]);
      }
    });
    
    closeModal();
  }

  handleCancel = (closeModal) => {
    this.resetFormStateFromProps();
    // Wait 100ms so user can see the values revert before closing
    setTimeout(() => {
      closeModal();
    }, 100);
  }

  renderTabNavigation = () =>
    <TabNavigation
      selectTab={(selectedTab) => this.setState({ selectedTab })}
      selectedTab={this.state.selectedTab}
      tabs={['Design', 'Manage']}
    />

  renderSelectedTab = (closeModal) => {
    return {
      'Design': () => this.renderDesignTab(closeModal),
      'Manage': this.renderManageTab
    }[this.state.selectedTab]();
  }

  renderManageTab = () =>
    <div className="manage-tab">
      <h2 className="title">Sign out of your account</h2>
      <button
        type="button"
        className="button -white"
        onClick={this.props.signOut}
      >
        Sign Out
      </button>
    </div>

  renderDesignTab = (closeModal) =>
    <div className="design-tab">
      <section className="part-of-the-website">
        <h2 className="title">Page: Review</h2>

        <div className="settings">
          <div className="setting">
            <div className="comment">
              Links to Github and Patreon
            </div>
            <Select
              className="react-select -settings"
              value={this.state.formState.hideSocialButtons}
              updateValue={(val) => this.updateFormState({ ...this.state.formState, hideSocialButtons: val })}
              options={[
                { value: false, label: 'Show Social Buttons' },
                { value: true, label: 'Hide Social Buttons' },
              ]}
            />
          </div>

          <div className="setting">
            <div className="comment">
              "Fill-In Answer" flashcards
            </div>
            <Select
              className="react-select -settings"
              value={this.state.formState.clozeDeletionMode}
              updateValue={(val) => this.updateFormState({ ...this.state.formState, clozeDeletionMode: val })}
              options={[
                { value: 'typing', label: 'Require typing' },
                { value: 'clicking', label: 'Just click' },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="part-of-the-website">
        <h2 className="title">Page: Course Creation</h2>

        <div className="settings">
          <div className="setting">
            <div className="comment">
              Order of flashcards
            </div>
            <Select
              className="react-select -settings"
              value={this.state.formState.flashcardOrder}
              updateValue={(val) => this.updateFormState({ ...this.state.formState, flashcardOrder: val })}
              options={[
                { value: true, label: 'Oldest First' },
                { value: false, label: 'Newest First' },
              ]}
            />
          </div>

          <div className="setting">
            <div className="comment">
              Font for code blocks
            </div>
            <Select
              className="react-select -settings"
              value={this.state.formState.ifMonospace}
              updateValue={(val) => this.updateFormState({ ...this.state.formState, ifMonospace: val })}
              options={[
                { value: true, label: 'Monospace' },
                { value: false, label: 'Normal' },
              ]}
            />
          </div>
        </div>
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
    <TogglerAndModal toggler={this.props.toggler}>{(closeModal) => (
      <section className={`standard-modal ${css.local}`}>
        <div className="standard-modal__header">
          <h2 className="standard-modal__title">Settings</h2>
          {this.renderTabNavigation()}
        </div>

        <div className="standard-modal__main">
          {this.renderSelectedTab(closeModal)}
        </div>
      </section>
    )}</TogglerAndModal>
}

export default SettingsModal;
