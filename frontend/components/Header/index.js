import { Link } from 'react-router';
import { ArticlesDropdown } from './components/ArticlesDropdown';
import { Search } from './components/Search';
import { CurrentUser } from './components/CurrentUser';
import { SignInLinks } from './components/SignInLinks';
import css from './index.css';

@connect((state) => ({
  currentUser: state.global.Authentication.currentUser
}))
class Header extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object
  }

  static defaultProps = {
    currentUser: null
  }

  renderLogo = () =>
    <section className="logo">
      <Link to="/">
        <h1>MemCode</h1>
      </Link>
      {/* <div className="memorizing-is-hard-caption">
        Retain the understanding.
      </div> */}
    </section>

  renderNavigation = () =>
    <nav>
      <ArticlesDropdown/>
      <Link
        to="/courses"
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
      <CurrentUser currentUser={this.props.currentUser}/> :
      <SignInLinks/>
  )

  render = () =>
    <header className={css.header}>
      <div className="container -desktop">
        {this.renderLogo()}
        <Search currentUser={this.props.currentUser}/>

        <div className="nav-and-current-user">
          {this.renderNavigation()}
          {this.renderUser()}
        </div>
      </div>

      <div className="container -mobile">
        <div className="logo-and-user">
          {this.renderLogo()}
          {this.renderUser()}
        </div>

        {this.renderNavigation()}
        <Search currentUser={this.props.currentUser}/>
      </div>
    </header>
}

export { Header };
