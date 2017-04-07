import React from 'react';
import { Link } from 'react-router';
import css from './index.css';

class ProfileNavigation extends React.Component {
  static propTypes = {
    signOut: React.PropTypes.func.isRequired,
  }

  render = () =>
    <nav className={css.nav}>
      <div className="container">
        <section className="links">
          <Link
            to="/profile/courses-learned-by-me"
            activeClassName="active"
          >
            I'm learning
          </Link>
          <Link
            to="/profile/courses-created-by-me"
            activeClassName="active"
          >
            I created
          </Link>
        </section>
        <section className="settings">
          <i className="fa fa-cogs"/>

          <div className="tooltip">
            <a onClick={this.props.signOut}>Sign Out</a>
          </div>
        </section>
      </div>
    </nav>
}

import { AuthenticationActions } from '~/reducers/Authentication';
const mapDispatchToProps = (dispatch) => ({
  signOut: () => AuthenticationActions.signOut(dispatch)
});

import { connect } from 'react-redux';
ProfileNavigation = connect(() => ({}), mapDispatchToProps)(ProfileNavigation);

export { ProfileNavigation };
