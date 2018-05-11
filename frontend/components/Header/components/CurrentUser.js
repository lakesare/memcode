import { Link } from 'react-router';
import { LearnReviewLinks } from './LearnReviewLinks';

class CurrentUser extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    dontLinkToLearnOrReview: PropTypes.string
  }

  renderAvatar = () =>
    <Link className="avatar" to="/courses/learning" activeClassName="active">
      <img src={this.props.currentUser.avatarUrl}/>
    </Link>

  render = () =>
    <section className="current-user">
      <LearnReviewLinks currentUser={this.props.currentUser} dontLinkToLearnOrReview={this.props.dontLinkToLearnOrReview}/>
      {this.renderAvatar()}
    </section>
}

export { CurrentUser };
