import TogglerAndModal from '~/components/TogglerAndModal';
import TabNavigation from '~/components/TabNavigation';
import MyDuck from '~/ducks/MyDuck';
import SettingsDuck from '~/ducks/SettingsDuck';
import Select from '~/components/Select';
import { TextInput, FileInput, Select as FormSelect } from '~/components/_standardForm';
import Loading from '~/components/Loading';
import { AuthenticationActions } from '~/reducers/Authentication';
import api from '~/api';
import uploadAvatar from '~/services/uploadAvatar';
import getUserAvatar from '~/services/getUserAvatar';

import css from './index.scss';

class SettingsModal extends React.Component {
  static propTypes = {
    toggler:              PropTypes.element.isRequired,
    My:                   PropTypes.object.isRequired,
    Settings:             PropTypes.object.isRequired,
    MyActions:            PropTypes.object.isRequired,
    SettingsActions:      PropTypes.object.isRequired,
    currentUser:          PropTypes.object.isRequired,
    signOut:              PropTypes.func.isRequired,
    updateCurrentUser:    PropTypes.func.isRequired,
  }

  state = {
    selectedTab: 'UI',

    settingsFormState: {
      hideSocialButtons: false,
      clozeDeletionMode: 'typing',
      flashcardOrder:    true,
      ifMonospace:       false,
      editorTheme:       'followTheme',
    },

    profileFormState: {
      username:                     '',
      email:                        '',
      avatar:                       null,
      isSubscribedToMarketingEmails: 'true'
    },
    profileFormValidation: {},
    speUpdateAccount:      {},
    speUploadAvatar:       {},
    speDeleteAccount:      {},
    deletionCountdown:     null
  }

  componentWillUnmount = () => {
    clearInterval(this.deletionTimer);
  }

  componentDidMount = () => {
    this.resetSettingsFormStateFromProps();
    this.resetProfileFormStateFromProps();
  }

  resetSettingsFormStateFromProps = () => {
    this.setState({
      settingsFormState: {
        hideSocialButtons: this.props.Settings.hideSocialButtons,
        clozeDeletionMode: this.props.Settings.clozeDeletionMode,
        flashcardOrder:    this.props.Settings.flashcardOrder,
        ifMonospace:       this.props.Settings.ifMonospace,
        editorTheme:       this.props.Settings.editorTheme,
      }
    });
  }

  resetProfileFormStateFromProps = () => {
    const { currentUser } = this.props;
    this.setState({
      profileFormState: {
        username:                     currentUser.username || '',
        email:                        currentUser.email || '',
        avatar:                       null,
        isSubscribedToMarketingEmails: String(currentUser.isSubscribedToMarketingEmails)
      }
    });
  }

  updateSettingsFormState = settingsFormState => this.setState({ settingsFormState })
  updateProfileFormState  = profileFormState  => this.setState({ profileFormState })

  profileInputProps = () => ({
    formState:       this.state.profileFormState,
    updateFormState: this.updateProfileFormState,
    formValidation:  this.state.profileFormValidation
  })

  isSettingsDirty = () => {
    const { settingsFormState } = this.state;
    const { Settings } = this.props;
    return (
      settingsFormState.hideSocialButtons !== Settings.hideSocialButtons ||
      settingsFormState.clozeDeletionMode !== Settings.clozeDeletionMode ||
      settingsFormState.flashcardOrder    !== Settings.flashcardOrder    ||
      settingsFormState.ifMonospace       !== Settings.ifMonospace       ||
      settingsFormState.editorTheme       !== Settings.editorTheme
    );
  }

  isProfileDirty = () => {
    const { profileFormState } = this.state;
    const { currentUser } = this.props;
    return (
      profileFormState.username !== (currentUser.username || '') ||
      profileFormState.email    !== (currentUser.email    || '') ||
      profileFormState.avatar   !== null                        ||
      profileFormState.isSubscribedToMarketingEmails !== String(currentUser.isSubscribedToMarketingEmails)
    );
  }

  handleSettingsSave = closeModal => {
    const { settingsFormState } = this.state;
    const { Settings } = this.props;
    Object.keys(settingsFormState).forEach(key => {
      if (settingsFormState[key] !== Settings[key]) {
        this.props.SettingsActions.updateSetting(key, settingsFormState[key]);
      }
    });
    closeModal();
  }

  handleSettingsCancel = closeModal => {
    this.resetSettingsFormStateFromProps();
    setTimeout(() => { closeModal(); }, 100);
  }

  validateProfileForm = () => {
    const { profileFormState } = this.state;
    const validation = {};
    if (!profileFormState.username || profileFormState.username.trim().length < 2) {
      validation.username = 'Username must be at least 2 characters long';
    }
    if (!profileFormState.email || !profileFormState.email.includes('@')) {
      validation.email = 'Please provide a valid email address';
    }
    return Object.keys(validation).length === 0 ? true : validation;
  }

  handleProfileSave = async (event, closeModal) => {
    event.preventDefault();
    if (this.state.speUpdateAccount.status === 'request' || this.state.speUploadAvatar.status === 'request') return;

    const profileFormValidation = this.validateProfileForm();
    if (profileFormValidation !== true) {
      this.setState({ profileFormValidation });
      return;
    }
    this.setState({ profileFormValidation: {} });

    const { profileFormState } = this.state;
    let avatarUrl = null;

    try {
      if (profileFormState.avatar && profileFormState.avatar instanceof File) {
        avatarUrl = await uploadAvatar(
          speUploadAvatar => this.setState({ speUploadAvatar }),
          profileFormState.avatar
        );
      }

      const updateData = {
        username:                     profileFormState.username,
        email:                        profileFormState.email,
        isSubscribedToMarketingEmails: profileFormState.isSubscribedToMarketingEmails === 'true'
      };
      if (avatarUrl) { updateData.avatar_url = avatarUrl; }

      api.post.UserApi.updateAccount(
        speUpdateAccount => {
          this.setState({ speUpdateAccount });
          if (speUpdateAccount.status === 'success') {
            if (speUpdateAccount.payload.token) {
              localStorage.setItem('jwt', speUpdateAccount.payload.token);
            }
            this.props.updateCurrentUser(speUpdateAccount.payload.user);
            closeModal();
          }
        },
        updateData
      );
    } catch (error) {
      const updateData = {
        username:                     profileFormState.username,
        email:                        profileFormState.email,
        isSubscribedToMarketingEmails: profileFormState.isSubscribedToMarketingEmails === 'true'
      };
      api.post.UserApi.updateAccount(
        speUpdateAccount => {
          this.setState({ speUpdateAccount });
          if (speUpdateAccount.status === 'success') {
            if (speUpdateAccount.payload.token) {
              localStorage.setItem('jwt', speUpdateAccount.payload.token);
            }
            this.props.updateCurrentUser(speUpdateAccount.payload.user);
            closeModal();
          }
        },
        updateData
      );
    }
  }

  handleProfileCancel = closeModal => {
    this.resetProfileFormStateFromProps();
    this.setState({ speUpdateAccount: {}, speUploadAvatar: {}, profileFormValidation: {} });
    setTimeout(() => { closeModal(); }, 100);
  }

  apiDeleteAccount = () => {
    if (this.state.speDeleteAccount.status === 'request') return;
    api.post.UserApi.deleteAccount(
      speDeleteAccount => {
        this.setState({ speDeleteAccount });
        if (speDeleteAccount.status === 'success') { this.props.signOut(); }
      },
      {}
    );
  }

  startDeletionCountdown = () => {
    this.setState({ deletionCountdown: 10 });
    this.deletionTimer = setInterval(() => {
      this.setState(prevState => {
        if (prevState.deletionCountdown <= 1) {
          clearInterval(this.deletionTimer);
          this.apiDeleteAccount();
          return { deletionCountdown: 0 };
        }
        return { deletionCountdown: prevState.deletionCountdown - 1 };
      });
    }, 1000);
  }

  cancelDeletion = () => {
    clearInterval(this.deletionTimer);
    this.setState({ deletionCountdown: null });
  }

  renderUITab = closeModal =>
    <div className="ui-tab">
      <section className="part-of-the-website">
        <h2 className="title">Page: Review</h2>

        <div className="settings">
          <div className="setting">
            <div className="comment">Links to Github and Patreon</div>
            <Select
              className="react-select -settings"
              value={this.state.settingsFormState.hideSocialButtons}
              updateValue={val => this.updateSettingsFormState({ ...this.state.settingsFormState, hideSocialButtons: val })}
              options={[
                { value: false, label: 'Show Social Buttons' },
                { value: true,  label: 'Hide Social Buttons' },
              ]}
            />
          </div>

          <div className="setting">
            <div className="comment">"Fill-In Answer" flashcards</div>
            <Select
              className="react-select -settings"
              value={this.state.settingsFormState.clozeDeletionMode}
              updateValue={val => this.updateSettingsFormState({ ...this.state.settingsFormState, clozeDeletionMode: val })}
              options={[
                { value: 'typing',   label: 'Require typing' },
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
            <div className="comment">Order of flashcards</div>
            <Select
              className="react-select -settings"
              value={this.state.settingsFormState.flashcardOrder}
              updateValue={val => this.updateSettingsFormState({ ...this.state.settingsFormState, flashcardOrder: val })}
              options={[
                { value: true,  label: 'Oldest First' },
                { value: false, label: 'Newest First' },
              ]}
            />
          </div>

          <div className="setting">
            <div className="comment">Font for code blocks</div>
            <Select
              className="react-select -settings"
              value={this.state.settingsFormState.ifMonospace}
              updateValue={val => this.updateSettingsFormState({ ...this.state.settingsFormState, ifMonospace: val })}
              options={[
                { value: true,  label: 'Monospace' },
                { value: false, label: 'Normal' },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="part-of-the-website">
        <h2 className="title">Editor</h2>

        <div className="settings">
          <div className="setting">
            <div className="comment">Editor theme</div>
            <Select
              className="react-select -settings"
              value={this.state.settingsFormState.editorTheme}
              updateValue={val => this.updateSettingsFormState({ ...this.state.settingsFormState, editorTheme: val })}
              options={[
                { value: 'followTheme', label: 'Follow Theme' },
                { value: 'dark',        label: 'Dark' },
                { value: 'bright',      label: 'Bright' },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="buttons">
        <button
          type="button"
          className="button -white"
          onClick={() => this.handleSettingsCancel(closeModal)}
        >
          Cancel
        </button>
        <button
          type="button"
          className={`button -purple ${this.isSettingsDirty() ? '' : '-disabled'}`}
          disabled={!this.isSettingsDirty()}
          onClick={() => this.handleSettingsSave(closeModal)}
        >
          Save
        </button>
      </section>
    </div>

  renderProfileTab = closeModal =>
    <div className="standard-form -no-padding">
      <div className="form-insides">
        <form onSubmit={event => this.handleProfileSave(event, closeModal)}>
          <TextInput
            {...this.profileInputProps()}
            label="Username"
            name="username"
            placeholder="Enter your username"
          />

          <TextInput
            {...this.profileInputProps()}
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
          />

          <FormSelect
            {...this.profileInputProps()}
            label="Marketing Emails"
            name="isSubscribedToMarketingEmails"
            possibleValues={{
              true:  'Subscribed - Receive updates about new features',
              false: 'Unsubscribed - Do not send me marketing emails'
            }}
          />

          <FileInput
            {...this.profileInputProps()}
            label="Avatar"
            name="avatar"
            accept="image/*"
            currentFileUrl={getUserAvatar(this.props.currentUser)}
            previewSize={80}
          />

          <Loading enabledStatuses={['failure']} spe={this.state.speUpdateAccount}/>
          <Loading enabledStatuses={['failure']} spe={this.state.speUploadAvatar}/>

          <section className="form-buttons">
            <button
              type="button"
              className="button -white"
              onClick={() => this.handleProfileCancel(closeModal)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`button -purple ${this.isProfileDirty() ? '' : '-disabled'}`}
              disabled={!this.isProfileDirty() || this.state.speUpdateAccount.status === 'request' || this.state.speUploadAvatar.status === 'request'}
            >
              {(this.state.speUpdateAccount.status === 'request' || this.state.speUploadAvatar.status === 'request') ? 'Saving...' : 'Save Changes'}
            </button>
          </section>
        </form>
      </div>
    </div>

  renderManageTab = () =>
    <div className="manage-tab">
      <h2 className="title">Sign out</h2>
      <button
        type="button"
        className="button -white"
        onClick={this.props.signOut}
      >
        Sign Out
      </button>

      <h2 className="title delete-account-title">Delete your account</h2>
      <p className="delete-account-description">
        This permanently deletes your account and <b>everything tied to it</b> - the courses you created, all their flashcards, and your learning progress. This cannot be undone.
      </p>

      {this.state.deletionCountdown !== null ? (
        <div className="delete-account-countdown">
          <p>Deleting your account in <b>{this.state.deletionCountdown}</b>...</p>
          <Loading enabledStatuses={['failure']} spe={this.state.speDeleteAccount}/>
          <button
            type="button"
            className="button -white"
            onClick={this.cancelDeletion}
          >
            Cancel Deleting ({this.state.deletionCountdown})
          </button>
        </div>
      ) : (
        <TogglerAndModal
          toggler={
            <button type="button" className="button -red">
              Delete account
            </button>
          }
        >{closeConfirm =>
          <section className="standard-modal" style={{ maxWidth: '470px' }}>
            <div className="standard-modal__header">
              <h2 className="standard-modal__title">Delete account?</h2>
            </div>

            <div className="standard-modal__main">
              <div className="standard-modal__description">
                Are you absolutely sure? This permanently deletes your account and everything tied to it. There is no way back.
              </div>

              <section className="buttons" style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '35px' }}>
                <button type="button" className="button -white" onClick={closeConfirm}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="button -red"
                  onClick={() => { closeConfirm(); this.startDeletionCountdown(); }}
                >
                  Yes, delete my account
                </button>
              </section>
            </div>
          </section>
        }</TogglerAndModal>
      )}
    </div>

  renderSelectedTab = closeModal => ({
    'UI':      () => this.renderUITab(closeModal),
    'Profile': () => this.renderProfileTab(closeModal),
    'Manage':  () => this.renderManageTab(),
  })[this.state.selectedTab]()

  render = () =>
    <TogglerAndModal toggler={this.props.toggler}>{closeModal => (
      <section className={`standard-modal ${css.local}`}>
        <div className="standard-modal__header">
          <h2 className="standard-modal__title">Settings</h2>
          <TabNavigation
            selectTab={selectedTab => this.setState({ selectedTab })}
            selectedTab={this.state.selectedTab}
            tabs={['UI', 'Profile', 'Manage']}
          />
        </div>

        <div className="standard-modal__main">
          {this.renderSelectedTab(closeModal)}
        </div>
      </section>
    )}</TogglerAndModal>
}

export default connect(
  state => ({
    currentUser: state.global.Authentication.currentUser || false,
    My:          state.global.My,
    Settings:    state.global.Settings
  }),
  dispatch => ({
    MyActions:         dispatch(MyDuck.getActions),
    SettingsActions:   SettingsDuck.getActions(dispatch),
    signOut:           () => AuthenticationActions.signOut(dispatch),
    updateCurrentUser: user => AuthenticationActions.updateCurrentUser(dispatch, user)
  })
)(SettingsModal);
