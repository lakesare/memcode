import SpeImmutable from '~/services/SpeImmutable';
import api from '~/api';

import StandardTooltip from '~/components/StandardTooltip';
import Loading from '~/components/Loading';
import disableOnSpeRequest from '~/services/disableOnSpeRequest';

import NotificationLi from './components/NotificationLi';

import css from './index.css';

class NotificationsTogglerAndDropdown extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired
  }

  state = {
    speGetNotifications: {},
    speLoadMoreNotifications: {},
    amountOfAllNotifications: 0,
    // should be stored in the local storage before we implement global state via the reducer
    amountOfUnreadNotifications: localStorage.getItem('amountOfUnreadNotifications') || 0,
  }

  componentDidMount() {
    setTimeout(() => {
      this.apiGetMostRecentNotifications();
      this.apiGetNotificationsStatsForUser();
    }, 2000);
  }

  apiGetNotificationsStatsForUser = () =>
    api.NotificationApi.getNotificationStatsForUser(null, { userId: this.props.currentUser.id })
      .then((stats) => {
        this.setState({
          amountOfAllNotifications: stats.amountOfAllNotifications,
          amountOfUnreadNotifications: stats.amountOfUnreadNotifications
        });
        localStorage.setItem('amountOfUnreadNotifications', stats.amountOfUnreadNotifications);
      })

  apiGetMostRecentNotifications = () =>
    api.NotificationApi.getNotificationsForUser(
      (spe) => this.setState({ speGetNotifications: spe }),
      {
        userId: this.props.currentUser.id,
        limit: 15
      }
    )

  apiLoadMoreNotifications = () =>
    api.NotificationApi.getNotificationsForUser(
      (spe) => this.setState({ speLoadMoreNotifications: spe }),
      {
        userId: this.props.currentUser.id,
        limit: 10,
        offset: this.state.speGetNotifications.payload.length
      }
    )
      .then((notifications) => {
        this.setState({
          speGetNotifications: {
            ...this.state.speGetNotifications,
            payload: [
              ...this.state.speGetNotifications.payload,
              ...notifications
            ]
          }
        });
      })

  apiMarkAsReadOrUnread = (notification, ifRead) => {
    const updatedNotification = { ...notification, ifRead };
    const speGetNotifications = SpeImmutable.update(this.state.speGetNotifications, updatedNotification);

    const amountOfUnreadNotifications = this.state.amountOfUnreadNotifications + (ifRead ? -1 : 1);

    this.setState({ speGetNotifications, amountOfUnreadNotifications });
    localStorage.setItem('amountOfUnreadNotifications', amountOfUnreadNotifications);
    return api.NotificationApi.markAsReadOrUnread(null, {
      id: notification.id,
      ifRead
    });
  }

  apiMarkAllNotificationsAsRead = () => {
    this.setState({
      speGetNotifications: {
        ...this.state.speGetNotifications,
        payload: this.state.speGetNotifications.payload.map((notification) => ({
          ...notification,
          ifRead: true
        }))
      },
      amountOfUnreadNotifications: 0
    });
    localStorage.setItem('amountOfUnreadNotifications', 0);
    return api.NotificationApi.markAllNotificationsAsRead(null, { userId: this.props.currentUser.id });
  }

  isFooterShown = () => {
    if (this.state.speGetNotifications.status !== 'success') {
      return false;
    }
    const notifications = this.state.speGetNotifications.payload;
    return this.state.amountOfAllNotifications > notifications.length;
  }

  renderToggler = () =>
    <button
      type="button"
      className={`
        notifications-toggler
        ${css.toggler}
        ${this.state.amountOfUnreadNotifications > 0 ? '-there-are-unread-notifications' : '-there-are-no-unread-notifications'}
      `}
      style={disableOnSpeRequest(this.state.speGetNotifications, { opacity: 1 })}
    >
      <i className="material-icons">
        notifications_none
      </i>
      {
        this.state.amountOfUnreadNotifications > 0 &&
        <div className="amount-of-unread-notifications">{this.state.amountOfUnreadNotifications}</div>
      }
    </button>

  renderDropdownHeader = () =>
    <div className="header">
      <div className="title">
        Latest Notifications
      </div>
      {
        this.state.amountOfUnreadNotifications > 0 &&
        <button
          className="read-all-button"
          type="button"
          onClick={this.apiMarkAllNotificationsAsRead}
        >Read All</button>
      }
    </div>

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
        <Loading enabledStatuses={['success']} spe={this.state.speGetNotifications}>{(notifications) =>
          notifications.map((notification) =>
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
        trigger: 'click'
      }}
      width={400}
    >
      {this.renderToggler()}
    </StandardTooltip>
}

export default NotificationsTogglerAndDropdown;
