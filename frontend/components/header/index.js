import React from 'react';
import { Link } from 'react-router';
import css from './index.scss';

class Header extends React.Component {
  renderCurrentUser = () => {
    const currentUser = this.props.currentUser;
    if (currentUser) {
      return <div className='columns small-5'>
        <Link to='/profile'>{currentUser.username}</Link>
        <img src={currentUser.avatarUrl}/>
        <a onClick={this.signOut}>Sign Out</a>
      </div>
    } else {
      return (
        <a href="https://github.com/login/oauth/authorize?client_id=1d94a714bab1f1576872">
          Sign in with github!
        </a>
      )
    }
  }

  signOut = () => {
    localStorage.setItem('jwt', null);
    this.props.renewCurrentUserFromStorage();
  }

  render = () =>
    <nav className={css.nav}>
      <div className="row">
        <Link to="/courses"
              activeClassName={css.active}
              className='columns small-2'>Courses</Link>
        <Link to="/courses/new"
              activeClassName={css.active}
              className='columns small-3'>Create new course!</Link>

        { this.renderCurrentUser() }
      </div>
    </nav>
};

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
