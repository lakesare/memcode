import StandardTooltip from '~/components/StandardTooltip';
import Loading from '~/components/Loading';
import disableOnSpeRequest from '~/services/disableOnSpeRequest';

import NotificationsDuck from '~/ducks/NotificationsDuck';

import NotificationLi from './components/NotificationLi';

import css from './index.scss';

@connect(
  (state) => ({
    notifications: state.global.Notifications
  }),
  (dispatch) => ({
    NotificationsActions: dispatch(NotificationsDuck.getActions)
  })
)
class NotificationsTogglerAndDropdown extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    notifications: PropTypes.object.isRequired,
    NotificationsActions: PropTypes.object.isRequired
  }

  state = {
    speLoadMoreNotifications: {}
  }

  componentDidMount() {
    if (this.props.currentUser && this.props.currentUser.id) {
      this.props.NotificationsActions.apiGetNotificationsAndStats(this.props.currentUser.id);
    }
  }

  apiLoadMoreNotifications = () => {
    const spe = this.props.notifications.speNotificationsAndStats;
    if (spe.status !== 'success' || !spe.payload) return;
    
    const currentNotifications = spe.payload.notifications;
    const offset = currentNotifications.length;
    
    this.props.NotificationsActions.apiLoadMoreNotifications(
      this.props.currentUser.id,
      offset
    ).then((speLoadMore) => this.setState({ speLoadMoreNotifications: speLoadMore }));
  }

  apiMarkAsReadOrUnread = (notification, ifRead) => {
    const updatedNotification = { ...notification, ifRead };
    
    // Update Redux state first
    this.props.NotificationsActions.updateNotification(updatedNotification);
    
    // Then make API call
    this.props.NotificationsActions.apiMarkAsReadOrUnread(notification.id, ifRead);
  }

  apiMarkAllNotificationsAsRead = () => {
    // Update Redux state first
    this.props.NotificationsActions.markAllAsRead();
    
    // Then make API call
    this.props.NotificationsActions.apiMarkAllNotificationsAsRead(this.props.currentUser.id);
  }

  apiMarkNotificationsAsSeen = () => {
    this.props.NotificationsActions.apiMarkNotificationsAsSeen(this.props.currentUser.id);
  }

  isFooterShown = () => {
    const spe = this.props.notifications.speNotificationsAndStats;
    
    if (spe.status !== 'success' || !spe.payload) {
      return false;
    }
    
    const notifications = spe.payload.notifications;
    const totalNotifications = spe.payload.stats.amountOfAllNotifications;
    return totalNotifications > notifications.length;
  }

  renderToggler = () => {
    const spe = this.props.notifications.speNotificationsAndStats;
    const hasUnreadNotifications = spe.status === 'success' && spe.payload && spe.payload.stats.amountOfUnreadNotifications > 0;
    const shouldAnimate = hasUnreadNotifications && !this.props.notifications.didSeeNotifications;
    const shouldShowCount = hasUnreadNotifications && !this.props.notifications.didSeeNotifications;
    
    return (
      <button
        type="button"
        className={`
          notifications-toggler
          ${css.toggler}
          ${shouldAnimate ? '-there-are-unread-notifications' : '-there-are-no-unread-notifications'}
        `}
        style={disableOnSpeRequest(spe, { opacity: 1 })}
      >
        <i className="material-icons">
          notifications_none
        </i>
        {
          shouldShowCount &&
          <div className="amount-of-unread-notifications">{spe.payload.stats.amountOfUnreadNotifications}</div>
        }
      </button>
    );
  }

  renderDropdownHeader = () => {
    const spe = this.props.notifications.speNotificationsAndStats;
    const hasUnreadNotifications = spe.status === 'success' && spe.payload && spe.payload.stats.amountOfUnreadNotifications > 0;
    
    return (
      <div className="header">
        <div className="title">
          Latest Notifications
        </div>
        {
          hasUnreadNotifications &&
          <button
            className="read-all-button"
            type="button"
            onClick={this.apiMarkAllNotificationsAsRead}
          >Read All</button>
        }
      </div>
    );
  }

  renderDropdownFooter = () => (
    this.isFooterShown() &&
    <div className="footer" onClick={this.apiLoadMoreNotifications} style={disableOnSpeRequest(this.state.speLoadMoreNotifications)}>
      See More...
    </div>
  )

  renderDropdown = () =>
    <div className={css.dropdown}>
      {this.renderDropdownHeader()}
      <ul className={`notifications ${this.isFooterShown() ? '' : '-no-footer'}`}>
        <Loading enabledStatuses={['success']} spe={this.props.notifications.speNotificationsAndStats}>{(data) =>
          data.notifications.map((notification) =>
            <NotificationLi
              key={notification.id}
              notification={notification}
              apiMarkAsReadOrUnread={this.apiMarkAsReadOrUnread}
            />
          )
        }</Loading>
      </ul>
      {this.renderDropdownFooter()}
    </div>

  render = () =>
    <StandardTooltip
      tooltipEl={this.renderDropdown()}
      tooltipProps={{
        className: 'standard-tooltip -no-padding -dark',
        interactive: true,
        placement: 'bottom-end',
        trigger: 'click',
        onShow: () => {
          // Mark notifications as seen when the dropdown opens
          const spe = this.props.notifications.speNotificationsAndStats;
          const hasUnreadNotifications = spe.status === 'success' && spe.payload && spe.payload.stats.amountOfUnreadNotifications > 0;
          if (hasUnreadNotifications && !this.props.notifications.didSeeNotifications) {
            this.apiMarkNotificationsAsSeen();
          }
        }
      }}
      width={400}
    >
      {this.renderToggler()}
    </StandardTooltip>
}

export default NotificationsTogglerAndDropdown;
