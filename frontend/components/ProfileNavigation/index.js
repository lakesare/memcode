import { AuthenticationActions } from '~/reducers/Authentication';
import { orFalse } from '~/services/orFalse';

import { NavLink } from 'react-router-dom';
import css from './index.css';

@connect(
  (state) => ({
    currentUser: state.global.Authentication.currentUser || false
  }),
  (dispatch) => ({
    signOut: () => AuthenticationActions.signOut(dispatch)
  })
)
class ProfileNavigation extends React.Component {
  static propTypes = {
    signOut: PropTypes.func.isRequired,
    currentUser: orFalse(PropTypes.object).isRequired
  }

  render = () => (
    this.props.currentUser &&
    <nav className={css.nav}>
      <div className="container">
        <section className="links">
          <NavLink exact to="/courses">
            <i className="fa fa-folder"/>
            All <span className="hide-on-mobile" style={{ paddingLeft: 3 }}>Courses</span>
          </NavLink>
          <NavLink exact to="/courses/learning">
            <i className="fa fa-graduation-cap"/>
            Learning
          </NavLink>
          <NavLink exact to="/courses/created">
            <i className="fa fa-paint-brush"/>
            Created
          </NavLink>
        </section>

        <section className="settings standard-tooltip">
          <span className="toggler">
            <i className="fa fa-cog"/>
          </span>
          <div className="modal -standard-tooltip-list">
            <a onClick={this.props.signOut}>Sign Out</a>
          </div>
        </section>
      </div>
    </nav>
  )
}

export { ProfileNavigation };
