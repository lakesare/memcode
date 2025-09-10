import orFalse from '~/services/orFalse';
import { AuthenticationActions } from '~/reducers/Authentication';
import { NavLink } from 'react-router-dom';
import { SignInLinks } from './components/SignInLinks';
import CurrentUser from './components/CurrentUser';
import Logo from './components/Logo';
import CoursesDropdown from './components/CoursesDropdown';
import CreateCourseButton from '~/components/CreateCourseButton';

import css from './index.scss';

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
      <CreateCourseButton>
        <button className="button link create">Create</button>
      </CreateCourseButton>
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

  render = () =>
    <header className={css.header}>
      <div className="container">
        <Logo currentUser={this.props.currentUser}/>

        <div className="nav-and-current-user">
          {this.renderNavigation()}
          {this.renderUser()}
        </div>
      </div>
    </header>
}

export { Header };
export default Header;
