import React from 'react';
import { Link } from 'react-router';
import css from './index.css';

class Header extends React.Component {
  static propTypes = {
    renewCurrentUserFromStorage: React.PropTypes.func.isRequired,
    currentUser: React.PropTypes.object
  }

  static defaultProps = {
    currentUser: null
  }

  signOut = () => {
    localStorage.setItem('jwt', null);
    this.props.renewCurrentUserFromStorage();
  }

  renderCurrentUser = () => {
    const currentUser = this.props.currentUser;
    if (currentUser) {
      return (
        <section className="current-user">
          <Link to="/profile">
            <img className="avatar" src={currentUser.avatarUrl}/>
          </Link>
          <a className="sign-out" onClick={this.signOut}>sign out</a>
        </section>
      );
    } else {
      return (
        <section className="current-user">
          <a href="https://github.com/login/oauth/authorize?client_id=1d94a714bab1f1576872">
            Sign in with github!
          </a>
        </section>
      );
    }
  }

  renderNavigation = () =>
    <nav>
      <Link
        to="/courses"
        activeClassName="active"
      >all courses</Link>
      <Link
        to="/courses/new"
        activeClassName="active"
      >create own course!</Link>
    </nav>

  render = () =>
    <header className={css.header}>
      <div className="container">
        <section className="logo">
          <h1>MemCode</h1>
          <div className="memorizing-is-hard-caption">
            Memorizing is hard.<br/>
            Let's get started.
          </div>
        </section>
        {this.renderNavigation()}
        {this.renderCurrentUser()}
      </div>
    </header>
}

import { renewCurrentUserFromStorage } from '../../ducks/authentication';
const mapStateToProps = (state) => ({
  currentUser: state.authentication.currentUser
});
const mapDispatchToProps = (dispatch) => ({
  renewCurrentUserFromStorage: () => renewCurrentUserFromStorage(dispatch)
});

import { connect } from 'react-redux';
Header = connect(mapStateToProps, mapDispatchToProps)(Header);

export { Header };
