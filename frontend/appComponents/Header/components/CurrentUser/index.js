import { Link } from 'react-router-dom';
import StandardTooltip from '~/components/StandardTooltip';
import LearnReviewLinks from './components/LearnReviewLinks';
import NotificationsTogglerAndDropdown from './components/NotificationsTogglerAndDropdown';
import SettingsModal from './components/SettingsModal';

class CurrentUser extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    dontLinkToLearnOrReview: PropTypes.number
  }

  renderDropdown = () =>
    <div>
      <div style={{ "textAlign": "right" }}>Signed in as {this.props.currentUser.username} | via {this.props.currentUser.oauthProvider}</div>
      <ul style={{ marginTop: 10 }} className="standard-tooltip-dropdown">
        <li>
          <Link to={`/users/${this.props.currentUser.id}`}>Profile</Link>
        </li>

        <li>
          <SettingsModal toggler={<button type="button">Settings</button>}/>
        </li>

        <li>
          <Link to="/contact">Contact Memcode</Link>
        </li>
      </ul>
    </div>

  renderAvatar = () =>
    <StandardTooltip
      tooltipEl={this.renderDropdown()}
      tooltipProps={{
        interactive: true,
        placement: 'bottom-end',
        trigger: 'click',
      }}
      width={170}
    >
      <button type="button" className="avatar">
        <img
          src={this.props.currentUser.avatarUrl}
          alt="Avatar of a current user"
        />
      </button>
    </StandardTooltip>

  render = () =>
    <section className="current-user">
      <NotificationsTogglerAndDropdown currentUser={this.props.currentUser}/>
      <LearnReviewLinks currentUser={this.props.currentUser} dontLinkToLearnOrReview={this.props.dontLinkToLearnOrReview}/>
      {this.renderAvatar()}
    </section>
}

export default CurrentUser;
