import React from 'react';
import { Link } from 'react-router';
import css from './header.scss';

let Header = React.createClass({
  renderCurrentUser() {
    if (currentUser) {
      return <div className='columns small-5'>
        <Link to='/profile'>{currentUser.username}</Link>
        <a href='/auth/logout'>logout</a>
      </div>
    } else {
      return <a href="/auth/login"
         className='columns small-3'>log in</a>
    }
  },

  render() {
    return(
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
    )
  }
});

export { Header };
