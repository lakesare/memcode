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
  })
)
class Header extends React.Component {
  static propTypes = {
    currentUser: orFalse(PropTypes.object).isRequired,
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
        <CoursesDropdown/>
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
          <CoursesDropdown/>
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
        window.innerWidth >= 500 ?
          this.renderDesktop() :
          this.renderMobile()
      }
    </header>
}

export { Header };
export default Header;
