import orFalse from '~/services/orFalse';
import { AuthenticationActions } from '~/reducers/Authentication';
import { NavLink } from 'react-router-dom';
import { Search } from './components/Search';
import { SignInLinks } from './components/SignInLinks';
import CurrentUser from './components/CurrentUser';
import Logo from './components/Logo';

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
    dontLinkToLearnOrReview: PropTypes.string
  }

  renderNavigation = () =>
    <nav>
      <NavLink
        exact
        to="/courses"
        className="link courses"
      >courses</NavLink>
      <NavLink
        exact
        to="/courses/new"
        className="link create"
      >create</NavLink>
      {
        !this.props.currentUser &&
        <NavLink
          exact
          to="/contact"
          className="link"
        >contact</NavLink>
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
      <Logo/>
      <Search currentUser={this.props.currentUser}/>

      <div className="nav-and-current-user">
        {this.renderNavigation()}
        {this.renderUser()}
      </div>
    </div>

  renderMobile = () =>
    <div className="container -mobile">
      <div className="logo-and-user">
        <Logo/>
        {this.renderUser()}
      </div>

      {
        !this.props.currentUser &&
        this.renderNavigation()
      }

      <Search currentUser={this.props.currentUser}/>
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
