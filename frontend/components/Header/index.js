import React from 'react';
import { Link } from 'react-router';
import { CurrentUser } from './components/CurrentUser';
import css from './index.css';

class Header extends React.Component {
  static propTypes = {
    currentUser: React.PropTypes.object
  }

  static defaultProps = {
    currentUser: null
  }

  renderNavigation = () =>
    <nav>
      <Link
        to="/courses"
        activeClassName="active"
        className="link"
      >all courses</Link>
      <Link
        to="/courses/new"
        activeClassName="active"
        className="link"
      >create own course!</Link>
      <CurrentUser currentUser={this.props.currentUser}/>
    </nav>

  render = () =>
    <header className={css.header}>
      <div className="container">
        <section className="logo">
          <Link to="/profile/courses-learned-by-me">
            <h1>MemCode</h1>
          </Link>
          {/* <div className="memorizing-is-hard-caption">
            Memorizing is hard.<br/>
            Let's get started.
          </div>*/}
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
