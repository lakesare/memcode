
import StandardTooltip from '~/components/StandardTooltip';
import Loading from '~/components/Loading';
import disableOnSpeRequest from '~/services/disableOnSpeRequest';

import NotificationLi from './components/NotificationLi';

import css from './index.css';

import NotificationsDuck from '~/ducks/NotificationsDuck';

@connect(
  (state) => ({
    Notifications: state.global.Notifications
  }),
  (dispatch) => ({
    NotificationsActions: dispatch(NotificationsDuck.getActions)
  })
)
class NotificationsTogglerAndDropdown extends React.Component {
  static propTypes = {
    Notifications: PropTypes.object.isRequired,
    NotificationsActions: PropTypes.object.isRequired
  }

  componentDidMount() {
    setTimeout(() => {
      this.apiGetMostRecentNotifications();
      this.apiGetNotificationsStatsForUser();
    }, 2000);
  }

  apiGetNotificationsStatsForUser = () =>
    this.props.NotificationsActions.apiGetNotificationsStatsForUser()

  apiGetMostRecentNotifications = () =>
    this.props.NotificationsActions.apiGetMostRecentNotifications()

  apiLoadMoreNotifications = () =>
    this.props.NotificationsActions.apiLoadMoreNotifications()

  apiMarkAsReadOrUnread = (notification, ifRead) =>
    this.props.NotificationsActions.apiMarkAsReadOrUnread(notification, ifRead)

  apiMarkAllNotificationsAsRead = () =>
    this.props.NotificationsActions.apiMarkAllNotificationsAsRead()

  isFooterShown = () => {
    const notifications = this.props.Notifications.speGetNotifications.payload;
    return this.props.Notifications.amountOfAllNotifications > notifications.length;
  }

  renderToggler = () =>
    <button
      type="button"
      className={`
        notifications-toggler
        ${css.toggler}
        ${this.props.Notifications.amountOfUnreadNotifications > 0 ? '-there-are-unread-notifications' : '-there-are-no-unread-notifications'}
      `}
      style={disableOnSpeRequest(this.props.Notifications.speGetNotifications, { opacity: 1 })}
    >
      <i className="material-icons">
        notifications_none
      </i>
      {
        this.props.Notifications.amountOfUnreadNotifications > 0 &&
        <div className="amount-of-unread-notifications">{this.props.Notifications.amountOfUnreadNotifications}</div>
      }
    </button>

  renderDropdownHeader = () =>
    <div className="header">
      <div className="title">
        Latest Notifications
      </div>
      {
        this.props.Notifications.amountOfUnreadNotifications > 0 &&
        <button
          className="read-all-button"
          type="button"
          onClick={this.apiMarkAllNotificationsAsRead}
        >Read All</button>
      }
    </div>

  renderDropdownFooter = () => (
    this.isFooterShown() &&
    <div className="footer" onClick={this.apiLoadMoreNotifications} style={disableOnSpeRequest(this.props.Notifications.speLoadMoreNotifications)}>
      See More...
    </div>
  )

  renderDropdown = () =>
    <Loading enabledStatuses={['success']} spe={this.props.Notifications.speGetNotifications}>{(notifications) =>
      <div className={css.dropdown}>
        {this.renderDropdownHeader()}
        <ul className={`notifications ${this.isFooterShown() ? '' : '-no-footer'}`}>
          {notifications.map((notification) =>
            <NotificationLi
              key={notification.id}
              notification={notification}
              apiMarkAsReadOrUnread={this.apiMarkAsReadOrUnread}
            />
          )}
        </ul>
        {this.renderDropdownFooter()}
      </div>
    }</Loading>

  render = () =>
    <StandardTooltip
      tooltipEl={this.renderDropdown()}
      tooltipProps={{
        className: 'standard-tooltip -no-padding -dark',
        interactive: true,
        placement: 'bottom-end',
        trigger: 'click'
      }}
      width={600}
    >
      {this.renderToggler()}
    </StandardTooltip>
}

export default NotificationsTogglerAndDropdown;
