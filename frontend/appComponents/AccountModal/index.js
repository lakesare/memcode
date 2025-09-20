import TogglerAndModal from '~/components/TogglerAndModal';
import TabNavigation from '~/components/TabNavigation';
import { TextInput, FileInput, Select } from '~/components/_standardForm';
import Loading from '~/components/Loading';
import { AuthenticationActions } from '~/reducers/Authentication';
import api from '~/api';
import uploadAvatar from '~/services/uploadAvatar';
import getUserAvatar from '~/services/getUserAvatar';

import css from './index.scss';

@connect(
  (state) => ({
    currentUser: state.global.Authentication.currentUser || false,
  }),
  (dispatch) => ({
    signOut: () => AuthenticationActions.signOut(dispatch),
    updateCurrentUser: (user) => AuthenticationActions.updateCurrentUser(dispatch, user)
  })
)
class AccountModal extends React.Component {
  static propTypes = {
    toggler: PropTypes.element.isRequired,
    currentUser: PropTypes.object.isRequired,
    signOut: PropTypes.func.isRequired,
    updateCurrentUser: PropTypes.func.isRequired,
  }

  state = {
    selectedTab: 'Account',
    formState: {
      username: '',
      email: '',
      avatar: null,
      isSubscribedToMarketingEmails: 'true'
    },
    formValidation: {},
    speUpdateAccount: {},
    speUploadAvatar: {}
  }

  componentDidMount = () => {
    this.resetFormStateFromProps();
  }

  resetFormStateFromProps = () => {
    const { currentUser } = this.props;
    this.setState({
      formState: {
        username: currentUser.username || '',
        email: currentUser.email || '',
        avatar: null,
        isSubscribedToMarketingEmails: String(currentUser.isSubscribedToMarketingEmails)
      }
    });
  }

  updateFormState = (formState) => {
    this.setState({ formState });
  }

  inputProps = () => ({
    formState: this.state.formState,
    updateFormState: this.updateFormState,
    formValidation: this.state.formValidation
  })

  isDirty = () => {
    const { formState } = this.state;
    const { currentUser } = this.props;
    return (
      formState.username !== (currentUser.username || '') ||
      formState.email !== (currentUser.email || '') ||
      formState.avatar !== null ||
      formState.isSubscribedToMarketingEmails !== String(currentUser.isSubscribedToMarketingEmails)
    );
  }

  validateForm = () => {
    const { formState } = this.state;
    const validation = {};

    // Validate username
    if (!formState.username || formState.username.trim().length < 2) {
      validation.username = 'Username must be at least 2 characters long';
    }

    // Validate email
    if (!formState.email || !formState.email.includes('@')) {
      validation.email = 'Please provide a valid email address';
    }

    return Object.keys(validation).length === 0 ? true : validation;
  }

  handleSave = async (event, closeModal) => {
    event.preventDefault();
    
    if (this.state.speUpdateAccount.status === 'request' || this.state.speUploadAvatar.status === 'request') return;

    const formValidation = this.validateForm();
    if (formValidation !== true) {
      this.setState({ formValidation });
      return;
    }

    // Clear validation if form is valid
    this.setState({ formValidation: {} });

    const { formState } = this.state;
    let avatarUrl = null;
    
    try {
      // Upload avatar first if a new file was selected
      if (formState.avatar && formState.avatar instanceof File) {
        avatarUrl = await uploadAvatar(
          (speUploadAvatar) => this.setState({ speUploadAvatar }),
          formState.avatar
        );
      }
      
      // Prepare data for user update
      const updateData = {
        username: formState.username,
        email: formState.email,
        isSubscribedToMarketingEmails: formState.isSubscribedToMarketingEmails === 'true'
      };
      
      // Include avatar_url if we uploaded a new one
      if (avatarUrl) {
        updateData.avatar_url = avatarUrl;
      }
      
      // Update user account
      api.post.UserApi.updateAccount(
        (speUpdateAccount) => {
          this.setState({ speUpdateAccount });
          if (speUpdateAccount.status === 'success') {
            // Update JWT token in localStorage with the new token
            if (speUpdateAccount.payload.token) {
              localStorage.setItem('jwt', speUpdateAccount.payload.token);
            }
            // Update current user in Redux store
            this.props.updateCurrentUser(speUpdateAccount.payload.user);
            closeModal();
          }
        },
        updateData
      );
      
    } catch (error) {
      console.error('Avatar upload failed:', error);
      // Continue with account update even if avatar upload fails
      const updateData = {
        username: formState.username,
        email: formState.email,
        isSubscribedToMarketingEmails: formState.isSubscribedToMarketingEmails === 'true'
      };
      
      api.post.UserApi.updateAccount(
        (speUpdateAccount) => {
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

  handleCancel = (closeModal) => {
    this.resetFormStateFromProps();
    this.setState({ 
      speUpdateAccount: {},
      speUploadAvatar: {},
      formValidation: {} 
    });
    // Wait 100ms so user can see the values revert before closing
    setTimeout(() => {
      closeModal();
    }, 100);
  }

  renderTabNavigation = () =>
    <TabNavigation
      selectTab={(selectedTab) => this.setState({ selectedTab })}
      selectedTab={this.state.selectedTab}
      tabs={['Account', 'Security']}
    />

  renderSelectedTab = (closeModal) => {
    return {
      'Account': () => this.renderAccountTab(closeModal),
      'Security': this.renderSecurityTab
    }[this.state.selectedTab]();
  }

  renderSecurityTab = () =>
    <div className="security-tab">
      <h2 className="title">Sign out of your account</h2>
      <button
        type="button"
        className="button -white"
        onClick={this.props.signOut}
      >
        Sign Out
      </button>
    </div>

  renderAccountTab = (closeModal) =>
    <div className="standard-form -no-padding">
      <div className="form-insides">
        <form onSubmit={(event) => this.handleSave(event, closeModal)}>
          <h2 className="title">Account Information</h2>

          <TextInput
            {...this.inputProps()}
            label="Username"
            name="username"
            placeholder="Enter your username"
          />

          <TextInput
            {...this.inputProps()}
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
          />

          <Select
            {...this.inputProps()}
            label="Marketing Emails"
            name="isSubscribedToMarketingEmails"
            possibleValues={{
              true: 'Subscribed - Receive updates about new features',
              false: 'Unsubscribed - Do not send me marketing emails'
            }}
          />

          <FileInput
            {...this.inputProps()}
            label="Avatar"
            name="avatar"
            accept="image/*"
            currentFileUrl={getUserAvatar(this.props.currentUser)}
            previewSize={80}
          />

          <Loading enabledStatuses={['failure']} spe={this.state.speUpdateAccount} />
          <Loading enabledStatuses={['failure']} spe={this.state.speUploadAvatar} />

          <section className="form-buttons">
            <button
              type="button"
              className="button -white"
              onClick={() => this.handleCancel(closeModal)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`button -purple ${this.isDirty() ? '' : '-disabled'}`}
            disabled={!this.isDirty() || this.state.speUpdateAccount.status === 'request' || this.state.speUploadAvatar.status === 'request'}
            >
            {(this.state.speUpdateAccount.status === 'request' || this.state.speUploadAvatar.status === 'request') ? 'Saving...' : 'Save Changes'}
            </button>
          </section>
        </form>
      </div>
    </div>

  render = () =>
    <TogglerAndModal toggler={this.props.toggler}>{(closeModal) => (
      <section className={`standard-modal ${css.local}`}>
        <div className="standard-modal__header">
          <h2 className="standard-modal__title">Account</h2>
          {this.renderTabNavigation()}
        </div>

        <div className="standard-modal__main">
          {this.renderSelectedTab(closeModal)}
        </div>
      </section>
    )}</TogglerAndModal>
}

export default AccountModal;