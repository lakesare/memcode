import React from 'react';
import PropTypes from 'prop-types';

import TogglerAndModal from '~/components/TogglerAndModal';
import TabNavigation from '~/components/TabNavigation';
import { TextInput } from '~/components/_standardForm';
import Loading from '~/components/Loading';
import api from '~/api';

import css from './index.scss';

class AuthModal extends React.Component {
  static propTypes = {
    toggler: PropTypes.element.isRequired,
    onSuccess: PropTypes.func
  }

  static defaultProps = {
    onSuccess: () => {}
  }

  state = {
    selectedTab: 'Sign Up',
    // Sign up form
    signupFormState: {
      username: '',
      email: '',
      password: ''
    },
    speSignup: {},
    // Sign in form
    signinFormState: {
      username: '',
      password: ''
    },
    speSignin: {}
  }

  // Helper methods for form input props
  signupInputProps = () => ({
    formState: this.state.signupFormState,
    updateFormState: (signupFormState) => this.setState({ signupFormState }),
    formValidation: {} // Empty validation object since we use server-side validation
  })

  signinInputProps = () => ({
    formState: this.state.signinFormState,
    updateFormState: (signinFormState) => this.setState({ signinFormState }),
    formValidation: {} // Empty validation object since we use server-side validation
  })

  handleSignupSubmit = (event) => {
    event.preventDefault();
    
    if (this.state.speSignup.status === 'request') return;

    api.post.AuthApi.signup(
      (speSignup) => {
        this.setState({ speSignup });
        if (speSignup.status === 'success') {
          // Store JWT token
          localStorage.setItem('jwt', speSignup.payload.token);
          
          // Redirect to user profile page
          window.location.href = `/users/${speSignup.payload.user.id}?token=${encodeURIComponent(speSignup.payload.token)}`;
        }
      },
      this.state.signupFormState
    );
  }

  handleSigninSubmit = (event) => {
    event.preventDefault();
    
    if (this.state.speSignin.status === 'request') return;

    api.post.AuthApi.login(
      (speSignin) => {
        this.setState({ speSignin });
        if (speSignin.status === 'success') {
          // Store JWT token
          localStorage.setItem('jwt', speSignin.payload.token);
          
          // Redirect to user profile page
          window.location.href = `/users/${speSignin.payload.user.id}?token=${encodeURIComponent(speSignin.payload.token)}`;
        }
      },
      this.state.signinFormState
    );
  }


  renderTabNavigation = () =>
    <TabNavigation
      selectTab={(selectedTab) => this.setState({ selectedTab })}
      selectedTab={this.state.selectedTab}
      tabs={['Sign Up', 'Sign In']}
    />

  renderSignUpForm = (closeModal) => (
    <div className="standard-form -no-padding">
      <div className="form-insides">
        <form onSubmit={this.handleSignupSubmit}>
          <TextInput {...this.signupInputProps()} label="Username" name="username" autoFocus autocomplete={false}/>
          <TextInput {...this.signupInputProps()} label="Email" name="email" type="email"/>
          <TextInput {...this.signupInputProps()} label="Password (6+ characters)" name="password" type="password" autocomplete={false}/>

          <Loading enabledStatuses={['failure']} spe={this.state.speSignup} />

          <button
            type="submit"
            className="standard-submit-button button -purple"
            disabled={this.state.speSignup.status === 'request'}
          >
            {this.state.speSignup.status === 'request' ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  )

  renderSignInForm = (closeModal) => (
    <div className="standard-form -no-padding">
      <div className="form-insides">
        <form onSubmit={this.handleSigninSubmit}>
          <TextInput {...this.signinInputProps()} label="Username" name="username" autoFocus/>
          <TextInput {...this.signinInputProps()} label="Password" name="password" type="password"/>

          <Loading enabledStatuses={['failure']} spe={this.state.speSignin} />

          <button
            type="submit"
            className="standard-submit-button button -purple"
            disabled={this.state.speSignin.status === 'request'}
          >
            {this.state.speSignin.status === 'request' ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )

  renderSelectedTab = (closeModal) => {
    return {
      'Sign Up': () => this.renderSignUpForm(closeModal),
      'Sign In': () => this.renderSignInForm(closeModal)
    }[this.state.selectedTab]();
  }

  render = () => (
    <TogglerAndModal className={css.modal} toggler={this.props.toggler}>{(closeModal) =>
      <div className="standard-modal standard-modal--sm">
        <div className="standard-modal__header">
          <h2 className="standard-modal__title">Authentication</h2>
          {this.renderTabNavigation()}
        </div>

        <div className="standard-modal__main">
          {this.renderSelectedTab(closeModal)}
        </div>
      </div>
    }</TogglerAndModal>
  )
}

export default AuthModal;
