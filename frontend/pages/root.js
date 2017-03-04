import React, { Component, PropTypes } from 'react';

import { Header } from '~/components/Header';

class RootPage extends Component {
  static propTypes = {
    renewCurrentUserFromStorage: PropTypes.func.isRequired
  }

  componentDidMount = () => {
    this.tryToFindToken();
  }

  tryToFindToken = () => {
    const token = window.location.href.split('?token=')[1];
    if (token) {
      localStorage.setItem('jwt', token);
      window.location = '/';
      this.props.renewCurrentUserFromStorage();
    }
  }

  // getSecretInfo = () =>
  //   fetch('/secret_info', {
  //     headers: new Headers({
  //       "Content-Type": "application/json",
  //       Authorization: localStorage.getItem('jwt')
  //     })
  //   });

  render = () =>
    <main>
      <Header/>
    </main>
}

import { renewCurrentUserFromStorage } from '../ducks/authentication';

const mapDispatchToProps = dispatch => ({
  renewCurrentUserFromStorage: () => renewCurrentUserFromStorage(dispatch)
});

import { connect } from 'react-redux';

RootPage = connect(() => ({}), mapDispatchToProps)(RootPage);

export { RootPage };
