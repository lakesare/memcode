import React from 'react';
import { Link } from 'react-router';
import { CurrentUser } from './components/CurrentUser';
import css from './index.css';

class Header extends React.Component {
  static propTypes = {
    signOut: React.PropTypes.func.isRequired,
    currentUser: React.PropTypes.object.isRequired
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
        <CurrentUser currentUser={this.props.currentUser} signOut={this.props.signOut}/>
      </div>
    </header>
}

import { signOut } from '~/ducks/authentication';
const mapStateToProps = (state) => ({
  currentUser: state.authentication.currentUser
});
const mapDispatchToProps = (dispatch) => ({
  signOut: () => signOut(dispatch)
});

import { connect } from 'react-redux';
Header = connect(mapStateToProps, mapDispatchToProps)(Header);

export { Header };
