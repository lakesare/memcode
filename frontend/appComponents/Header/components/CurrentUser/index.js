import { Link } from 'react-router-dom';
import StandardTooltip from '~/components/StandardTooltip';
import LearnReviewLinks from './components/LearnReviewLinks';
import NotificationsTogglerAndDropdown from './components/NotificationsTogglerAndDropdown';

class CurrentUser extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    signOut: PropTypes.func.isRequired,
    dontLinkToLearnOrReview: PropTypes.number
  }

  renderDropdown = () =>
    <div>
      <div>Signed in as {this.props.currentUser.username} | via {this.props.currentUser.oauthProvider}</div>
      <ul style={{ marginTop: 10 }} className="standard-tooltip-dropdown">
        <li>
          <Link to={`/users/${this.props.currentUser.id}`}>Profile</Link>
        </li>
        <li>
          <button
            type="button"
            onClick={this.props.signOut}
          >
            Sign Out
          </button>
        </li>
      </ul>
    </div>

  renderAvatar = () =>
    <StandardTooltip
      tooltipEl={this.renderDropdown()}
      tooltipProps={{
        interactive: true,
        placement: 'bottom-end',
        trigger: 'click'
      }}
    >
      <div className="avatar">
        <img
          src={this.props.currentUser.avatarUrl}
          alt="Avatar of a current user"
        />
      </div>
    </StandardTooltip>

  render = () =>
    <section className="current-user">
      <NotificationsTogglerAndDropdown currentUser={this.props.currentUser}/>
      <LearnReviewLinks currentUser={this.props.currentUser} dontLinkToLearnOrReview={this.props.dontLinkToLearnOrReview}/>
      {this.renderAvatar()}
    </section>
}

export default CurrentUser;
