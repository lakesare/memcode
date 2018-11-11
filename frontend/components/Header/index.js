import { Link } from 'react-router';
import { ArticlesDropdown } from './components/ArticlesDropdown';
import { Search } from './components/Search';
import { SignInLinks } from './components/SignInLinks';
import CurrentUser from './components/CurrentUser';
import Logo from './components/Logo';

import css from './index.css';

@connect((state) => ({
  currentUser: state.global.Authentication.currentUser
}))
class Header extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object,
    dontLinkToLearnOrReview: PropTypes.string
  }

  static defaultProps = {
    currentUser: null
  }

  renderNavigation = () =>
    <nav>
      <ArticlesDropdown/>
      <Link
        to={this.props.currentUser ? '/courses/learning' : '/courses'}
        activeClassName="active"
        className="link courses"
      >courses</Link>
      <Link
        to="/courses/new"
        activeClassName="active"
        className="link create"
      ><i className="fa fa-plus"/>create</Link>
      <Link
        to="/contact"
        activeClassName="active"
        className="link contact"
      >contact</Link>
    </nav>

  renderUser = () => (
    this.props.currentUser ?
      <CurrentUser currentUser={this.props.currentUser} dontLinkToLearnOrReview={this.props.dontLinkToLearnOrReview}/> :
      <SignInLinks/>
  )

  render = () =>
    <header className={css.header}>
      <div className="container -desktop">
        <Logo/>
        <Search currentUser={this.props.currentUser}/>

        <div className="nav-and-current-user">
          {this.renderNavigation()}
          {this.renderUser()}
        </div>
      </div>

      <div className="container -mobile">
        <div className="logo-and-user">
          <Logo/>
          {this.renderUser()}
        </div>

        {this.renderNavigation()}
        <Search currentUser={this.props.currentUser}/>
      </div>
    </header>
}

export { Header };
export default Header;
