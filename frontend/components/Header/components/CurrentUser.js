import React from 'react';
import { Link } from 'react-router';

class CurrentUser extends React.Component {
  static propTypes = {
    signOut: React.PropTypes.func.isRequired,
    currentUser: React.PropTypes.object
  }

  static defaultProps = {
    currentUser: null
  }

  renderSignedInUser = (currentUser) =>
    <div>
      <Link className="avatar" to="/profile/courses-learned-by-me">
        <img src={currentUser.avatarUrl}/>
      </Link>
      <a className="sign-out" onClick={this.props.signOut}>SIGN OUT</a>
    </div>

  renderSignInLink = () =>
    <a href="https://github.com/login/oauth/authorize?client_id=1d94a714bab1f1576872">
      Sign in with github!
    </a>

  render = () =>
    <section className="current-user">
      {
        this.props.currentUser ?
        this.renderSignedInUser(this.props.currentUser) :
        this.renderSignInLink()
      }
    </section>
}

export { CurrentUser };
