import React from 'react';

import { Header } from '~/components/Header';
import { browserHistory } from 'react-router';

class RootPage extends React.Component {
  static propTypes = {
    signIn: React.PropTypes.func.isRequired
  }

  componentDidMount = () => {
    this.tryToFindToken();
  }

  tryToFindToken = () => {
    const token = window.location.href.split('?token=')[1];
    if (token) {
      this.props.signIn(token);
      browserHistory.push('/profile/courses-learned-by-me'); // needed?
    }
  }

  render = () =>
    <main>
      <Header/>
    </main>
}

import { signIn } from '~/ducks/authentication';
const mapDispatchToProps = dispatch => ({
  signIn: (token) => signIn(dispatch, token)
});

import { connect } from 'react-redux';
RootPage = connect(() => ({}), mapDispatchToProps)(RootPage);

export { RootPage };
