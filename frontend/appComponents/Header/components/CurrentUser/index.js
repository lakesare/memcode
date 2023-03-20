import { Link } from 'react-router-dom';
import StandardTooltip from '~/components/StandardTooltip';
import NotificationsTogglerAndDropdown from './components/NotificationsTogglerAndDropdown';

class CurrentUser extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
  }

  // renderDropdown = () =>
  //   <ul className="standard-tooltip-dropdown">
  //     <li>
  //       <SettingsModal toggler={<button type="button">Settings</button>}/>
  //     </li>
  //     <li>
  //       <Link to="/contact">Contact Memcode</Link>
  //     </li>
  //   </ul>

  renderAvatar = () =>
    // <StandardTooltip
    //   tooltipEl={this.renderDropdown()}
    //   tooltipProps={{
    //     interactive: true,
    //     placement: 'bottom-end',
    //     trigger: 'mouseenter',
    //   }}
    //   width={120}
    // >
      
    // </StandardTooltip>
    <div>
      <Link className="avatar" to={`/users/${this.props.currentUser.id}`}>
        <img
          src={this.props.currentUser.avatarUrl}
          alt="User"
        />
      </Link>
    </div>

  render = () =>
    <section className="current-user">
      <NotificationsTogglerAndDropdown currentUser={this.props.currentUser}/>
      {this.renderAvatar()}
    </section>
}

export default CurrentUser;
