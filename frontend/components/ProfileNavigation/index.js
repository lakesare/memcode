import { connect } from 'react-redux';
import { AuthenticationActions } from '~/reducers/Authentication';

import { Link } from 'react-router';
import css from './index.css';

@connect(
  (state) => ({
    currentUser: state.global.Authentication.currentUser || undefined
  }),
  (dispatch) => ({
    signOut: () => AuthenticationActions.signOut(dispatch)
  })
)
class ProfileNavigation extends React.Component {
  static propTypes = {
    signOut: PropTypes.func.isRequired,
    currentUser: PropTypes.object
  };

  static defaultProps = {
    currentUser: null
  }

  render = () =>
    <nav className={css.nav}>
      <div className="container">
        <section className="links">
          <Link
            to="/courses"
            activeClassName="active"
          >All courses</Link>
          <Link
            to="/profile/learning"
            activeClassName="active"
          >I'm learning</Link>
          <Link
            to="/profile/created"
            activeClassName="active"
          >I created</Link>
        </section>

        {
          this.props.currentUser &&
          <section className="settings">
            <i className="fa fa-cog"/>

            <div className="tooltip">
              <a onClick={this.props.signOut}>Sign Out</a>
            </div>
          </section>
        }
      </div>
    </nav>
}

export { ProfileNavigation };
