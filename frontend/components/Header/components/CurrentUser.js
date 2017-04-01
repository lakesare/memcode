import React from 'react';
import { Link } from 'react-router';

class CurrentUser extends React.Component {
  static propTypes = {
    currentUser: React.PropTypes.object
  }

  static defaultProps = {
    currentUser: null
  }

  renderSignedInUser = (currentUser) =>
    <Link className="avatar" to="/profile/courses-learned-by-me" activeClassName="active">
      <img src={currentUser.avatarUrl}/>
    </Link>

  renderSignInLink = () =>
    <a className="sign-in" href="https://github.com/login/oauth/authorize?client_id=1d94a714bab1f1576872">
      Sign in <i className="fa fa-github"/>
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
