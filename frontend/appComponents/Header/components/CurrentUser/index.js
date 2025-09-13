import { Link } from 'react-router-dom';
import StandardTooltip from '~/components/StandardTooltip';
import NotificationsTogglerAndDropdown from './components/NotificationsTogglerAndDropdown';
import SettingsModal from '~/appComponents/SettingsModal';
import AccountModal from '~/appComponents/AccountModal';
import getUserAvatar from '~/services/getUserAvatar';
import ThemeToggleButton from '~/appComponents/ThemeToggleButton';

import css from './index.scss';

class CurrentUser extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
  }


  renderDropdown = () =>
    <ul className="standard-tooltip-dropdown">
      <li>
        <Link to={`/users/${this.props.currentUser.id}`} className="dropdown-item">Home</Link>
      </li>
      <li>
        <SettingsModal toggler={<button type="button" className="dropdown-item">Settings</button>}/>
      </li>
      <li>
        <AccountModal toggler={<button type="button" className="dropdown-item">Account</button>}/>
      </li>
      <li>
        <ThemeToggleButton/>
      </li>
    </ul>

  renderAvatar = () =>
    <StandardTooltip
      tooltipEl={this.renderDropdown()}
      tooltipProps={{
        interactive: true,
        placement: 'bottom-end',
        trigger: 'mouseenter click',
        arrow: false
      }}
      width={60}
    >
      <div className="_tippy-needs-this-div">
        <Link className="avatar" to={`/users/${this.props.currentUser.id}`}>
          <img src={getUserAvatar(this.props.currentUser)} alt="User"/>
        </Link>
      </div>
    </StandardTooltip>

  render = () =>
    <section className={`current-user ${css.currentUser}`}>
      <NotificationsTogglerAndDropdown currentUser={this.props.currentUser}/>
      {this.renderAvatar()}
    </section>
}

export default CurrentUser;
