import orFalse from '~/services/orFalse';
import { AuthenticationActions } from '~/reducers/Authentication';
import { NavLink } from 'react-router-dom';
import { SignInLinks } from './components/SignInLinks';
import CurrentUser from './components/CurrentUser';
import Logo from './components/Logo';
import CoursesDropdown from './components/CoursesDropdown';

import css from './index.css';

@connect(
  (state) => ({
    currentUser: state.global.Authentication.currentUser || false
  }),
  (dispatch) => ({
    signOut: () => AuthenticationActions.signOut(dispatch)
  })
)
class Header extends React.Component {
  static propTypes = {
    currentUser: orFalse(PropTypes.object).isRequired,
    signOut: PropTypes.func.isRequired,
    dontLinkToLearnOrReview: PropTypes.number
  }

  renderNavigation = () =>
    <nav>
      {
        !this.props.currentUser &&
        <NavLink
          exact
          to="/courses"
          className="button link courses"
        >Courses</NavLink>
      }
      <NavLink
        exact
        to="/courses/new"
        className="button link create"
      >Create</NavLink>
      {
        this.props.currentUser &&
        <NavLink
          exact
          to="/courses/learning"
          className="button link my-courses"
        >Courses</NavLink>
      }
      {
        this.props.currentUser &&
        localStorage.getItem('enableTheCoursesDropdown') &&
        <CoursesDropdown
          toggler={
            <a className="button link main" style={{ marginRight: 0 }}>Main</a>
          }
        />
      }
      {
        !this.props.currentUser &&
        <NavLink
          exact
          to="/contact"
          className="button link contact"
        >Contact</NavLink>
      }
    </nav>

  renderUser = () => (
    this.props.currentUser ?
      <CurrentUser
        currentUser={this.props.currentUser}
        dontLinkToLearnOrReview={this.props.dontLinkToLearnOrReview}
        signOut={this.props.signOut}
      /> :
      <SignInLinks/>
  )

  renderDesktop = () =>
    <div className="container -desktop">
      <Logo currentUser={this.props.currentUser}/>

      <div className="nav-and-current-user">
        {this.renderNavigation()}
        {this.renderUser()}
      </div>
    </div>

  renderMobile = () =>
    <div className="container -mobile">
      <div className="logo-and-user">
        <Logo currentUser={this.props.currentUser} ifMobile/>

        {
          this.props.currentUser &&
          this.props.currentUser.username === "lakesare" &&
          <CoursesDropdown
            toggler={
              <a className="button link mobile-main" style={{ marginRight: 0 }}>Main</a>
            }
          />
        }

        {this.renderUser()}
      </div>

      {
        !this.props.currentUser &&
        this.renderNavigation()
      }
    </div>

  render = () =>
    <header className={css.header}>
      {
        window.innerWidth >= 930 ?
          this.renderDesktop() :
          this.renderMobile()
      }
    </header>
}

export { Header };
export default Header;
