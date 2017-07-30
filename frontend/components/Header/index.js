import { Link } from 'react-router';
import { CurrentUser } from './components/CurrentUser';
import { ArticlesDropdown } from './components/ArticlesDropdown';
import css from './index.css';

class Header extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object
  }

  static defaultProps = {
    currentUser: null
  }

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
      <CurrentUser currentUser={this.props.currentUser}/>
    </nav>

  render = () =>
    <header className={css.header}>
      <div className="container">
        <section className="logo">
          <Link to="/">
            <h1>MemCode</h1>
          </Link>
          {/* <div className="memorizing-is-hard-caption">
            Understanding is not enough.<br/>
            You must retain the understanding.
          </div> */}
        </section>
        {this.renderNavigation()}
      </div>
    </header>
}

const mapStateToProps = (state) => ({
  currentUser: state.global.Authentication.currentUser
});
const mapDispatchToProps = () => ({});

import { connect } from 'react-redux';
Header = connect(mapStateToProps, mapDispatchToProps)(Header);

export { Header };
