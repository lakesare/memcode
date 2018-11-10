import { Link } from 'react-router';
import LearnReviewLinks from './components/LearnReviewLinks';
import NotificationsTogglerAndDropdown from './components/NotificationsTogglerAndDropdown';

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
      <NotificationsTogglerAndDropdown currentUser={this.props.currentUser}/>
      {this.renderAvatar()}
    </section>
}

export default CurrentUser;
