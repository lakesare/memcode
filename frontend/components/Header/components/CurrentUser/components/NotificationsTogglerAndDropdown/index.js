import SpeImmutable from '~/services/SpeImmutable';
import NotificationApi from '~/api/NotificationApi';

import onClickOutside from 'react-onclickoutside';
import Loading from '~/components/Loading';
import disableOnSpeRequest from '~/services/disableOnSpeRequest';

import NotificationLi from './components/NotificationLi';

import css from './index.css';

@onClickOutside
class NotificationsTogglerAndDropdown extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired
  }

  state = {
    speGetNotifications: {},
    speLoadMoreNotifications: {},
    amountOfAllNotifications: 0,
    amountOfUnreadNotifications: 0,
    ifDropdownIsOpen: false
  }

  componentDidMount() {
    this.apiGetMostRecentNotifications();
    this.apiGetNotificationsStatsForUser();
  }

  apiGetNotificationsStatsForUser = () =>
    NotificationApi.getNotificationsStatsForUser(
      false,
      { userId: this.props.currentUser.id }
    )
      .then((stats) => {
        this.setState({
          amountOfAllNotifications: stats.amountOfAllNotifications,
          amountOfUnreadNotifications: stats.amountOfUnreadNotifications
        });
      })

  apiGetMostRecentNotifications = () =>
    NotificationApi.getMostRecentNotificationsOfUser(
      (spe) => this.setState({ speGetNotifications: spe }),
      {
        userId: this.props.currentUser.id,
        limit: 15
      }
    )

  apiLoadMoreNotifications = () =>
    NotificationApi.getMostRecentNotificationsOfUser(
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
    this.setState({
      speGetNotifications: SpeImmutable.update(this.state.speGetNotifications, updatedNotification),
      amountOfUnreadNotifications: this.state.amountOfUnreadNotifications + (ifRead ? -1 : 1)
    });
    return NotificationApi.markAsReadOrUnread(
      false,
      notification.id,
      { ifRead }
    );
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
    return NotificationApi.markAllNotificationsAsRead(
      false,
      { userId: this.props.currentUser.id }
    );
  }

  handleClickOutside = () =>
    this.setState({ ifDropdownIsOpen: false })

  renderToggler = () =>
    <div
      className="toggler"
      style={disableOnSpeRequest(this.state.speGetNotifications)}
      onClick={() => this.setState({ ifDropdownIsOpen: !this.state.ifDropdownIsOpen })}
    >
      <i className="fa fa-bell"/>
      {
        this.state.amountOfUnreadNotifications > 0 &&
        <div className="amount-of-unread-notifications">{this.state.amountOfUnreadNotifications}</div>
      }
    </div>

  renderDropdownHeader = () =>
    <div className="header">
      <button
        className="read-all-button"
        type="button"
        onClick={this.apiMarkAllNotificationsAsRead}
      >Read All</button>
    </div>

  renderDropdownFooter = (notifications) => (
    this.state.amountOfAllNotifications > notifications.length &&
    <div className="footer" onClick={this.apiLoadMoreNotifications} style={disableOnSpeRequest(this.state.speLoadMoreNotifications)}>
      See More...
    </div>
  )

  render = () =>
    <section
      className={`
        notifications-toggler-and-dropdown
        ${css.section}
        ${this.state.ifDropdownIsOpen ? '-dropdown-is-open' : '-dropdown-is-closed'}
        ${this.state.amountOfUnreadNotifications > 0 ? '-there-are-unread-notifications' : '-there-are-no-unread-notifications'}
      `}
    >
      {this.renderToggler()}
      <Loading enabledStatuses={['success']} spe={this.state.speGetNotifications}>{(notifications) =>
        <div className="dropdown standard-dropdown-with-arrow" style={{ display: this.state.ifDropdownIsOpen ? 'block' : 'none' }}>
          {this.renderDropdownHeader()}
          <ul className="notifications">
            {notifications.map((notification) =>
              <NotificationLi
                key={notification.id}
                notification={notification}
                apiMarkAsReadOrUnread={this.apiMarkAsReadOrUnread}
              />
            )}
          </ul>
          {this.renderDropdownFooter(notifications)}
        </div>
      }</Loading>
    </section>
}

export default NotificationsTogglerAndDropdown;
