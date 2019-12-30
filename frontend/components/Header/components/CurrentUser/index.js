import { NavLink } from 'react-router-dom';
import StandardTooltip from '~/components/StandardTooltip';
import LearnReviewLinks from './components/LearnReviewLinks';
import NotificationsTogglerAndDropdown from './components/NotificationsTogglerAndDropdown';

class CurrentUser extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    signOut: PropTypes.func.isRequired,
    dontLinkToLearnOrReview: PropTypes.string
  }

  renderDropdown = () =>
    <div>
      <div>Signed in as {this.props.currentUser.username} | via {this.props.currentUser.oauthProvider}</div>
      <ul style={{ marginTop: 10 }} className="standard-tooltip-dropdown">
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
        position: 'bottom-end',
        trigger: 'focus click'
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
      <NavLink
        to="/courses/learning"
        className="button -purple my-courses-link"
      >MY COURSES</NavLink>
      <NotificationsTogglerAndDropdown currentUser={this.props.currentUser}/>
      <LearnReviewLinks currentUser={this.props.currentUser} dontLinkToLearnOrReview={this.props.dontLinkToLearnOrReview}/>
      {this.renderAvatar()}
    </section>
}

export default CurrentUser;
