import { Link } from 'react-router';
import StandardTooltip from '~/components/StandardTooltip';
import NotificationsTogglerAndDropdown from './components/NotificationsTogglerAndDropdown';
import SettingsModal from '~/appComponents/SettingsModal';
import FocusModeModal from '~/appComponents/FocusModeModal';
import OfflineModal from '~/appComponents/OfflineModal';
import getUserAvatar from '~/services/getUserAvatar';
import ThemeToggleButton from '~/appComponents/ThemeToggleButton';
import SettingsDuck from '~/ducks/SettingsDuck';
import isUserAdmin from '../../../../../services/isUserAdmin.js';

import css from './index.scss';

class CurrentUser extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    Settings: PropTypes.object.isRequired,
    SettingsActions: PropTypes.object.isRequired,
    Offline: PropTypes.object.isRequired
  }


  renderDropdown = () =>
    <ul className="standard-tooltip-dropdown">
      <li>
        <Link to={`/users/${this.props.currentUser.id}`} className="dropdown-item">Home</Link>
      </li>
      {
        isUserAdmin(this.props.currentUser) &&
        <li>
          <Link to="/pdfs" className="dropdown-item">PDFs</Link>
        </li>
      }
      <li>
        <SettingsModal toggler={<button type="button" className="dropdown-item">Settings</button>}/>
      </li>
      <li>
        <FocusModeModal toggler={
          <button type="button" className="dropdown-item focus-item">
            {(this.props.Settings.focusedCategoryId || (this.props.Settings.focusedSubstring && this.props.Settings.focusedSubstring.trim() !== '')) && (
              <span className="focus-indicator" aria-hidden="true">•</span>
            )}
            Focus
          </button>
        }/>
      </li>
      <li>
        <OfflineModal toggler={
          <button type="button" className="dropdown-item offline-item">
            {this.props.Offline.notices.length > 0 && (
              <span className="focus-indicator" aria-hidden="true">•</span>
            )}
            Offline
          </button>
        }/>
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
          <img src={getUserAvatar(this.props.currentUser)}/>
        </Link>
      </div>
    </StandardTooltip>

  render = () =>
    <section className={`current-user ${css.currentUser}`}>
      <NotificationsTogglerAndDropdown currentUser={this.props.currentUser}/>
      {this.renderAvatar()}
    </section>
}

export default connect(
  (state) => ({
    Settings: state.global.Settings,
    Offline: state.global.Offline
  }),
  (dispatch) => ({
    SettingsActions: SettingsDuck.getActions(dispatch)
  })
)(CurrentUser);
