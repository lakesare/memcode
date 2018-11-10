import humanizePostgresInterval from '~/services/humanizePostgresInterval';
import SpeImmutable from '~/services/SpeImmutable';
import NotificationApi from '~/api/NotificationApi';

import { Link } from 'react-router';
import onClickOutside from 'react-onclickoutside';
import Loading from '~/components/Loading';
import disableOnSpeRequest from '~/services/disableOnSpeRequest';

import css from './index.css';

@onClickOutside
class NotificationsTogglerAndDropdown extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired
  }

  state = {
    speGetNotifications: {},
    ifDropdownIsOpen: false
  }

  componentDidMount() {
    this.apiGetLast30Notifications();
  }

  apiGetLast30Notifications = () =>
    NotificationApi.getMostRecentNotificationsOfUser(
      (spe) => this.setState({ speGetNotifications: spe }),
      { userId: this.props.currentUser.id, limit: 100 }
    )

  apiMarkAsReadOrUnread = (notification, ifRead) => {
    const updatedNotification = { ...notification, ifRead };
    this.setState({
      speGetNotifications: SpeImmutable.update(this.state.speGetNotifications, updatedNotification)
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
      }
    });
    return NotificationApi.markAllNotificationsAsRead(
      false,
      { userId: this.props.currentUser.id }
    );
  }

  handleClickOutside = () =>
    this.setState({ ifDropdownIsOpen: false })

  renderNotification = (notification, icon, title, content) =>
    <li
      className={`
        notification
        ${notification.ifRead ? '-already-read' : '-not-yet-read'}
        -type-${notification.type}
      `}
      key={notification.id}
    >
      <div className="icon">{icon}</div>
      <div className="title_and_content_and_created-at">
        <div className="title">{title}</div>
        <div className="content">{content}</div>
        <div className="created-at">{humanizePostgresInterval(notification.createdAtDiffFromNow)} ago</div>
      </div>
      <button
        type="button"
        className="mark-as-read-on-unread-button"
        onClick={() => this.apiMarkAsReadOrUnread(notification, !notification.ifRead)}
      ><div className="circle"/></button>
    </li>

  // Love it hate it but you did it!
  renderNotificationLi = (notification) => {
    // notification.type = 'memcode_added_some_feature';
    switch (notification.type) {
      case 'welcome_to_memcode':
        return this.renderNotification(
          notification,
          <i className="fa fa-heart" style={{ fontSize: 21, color: 'red' }}/>,
          <span style={{ color: 'rgb(161, 161, 161)' }}>Welcome to Memcode!</span>,
          <div>
            Create flashcards, review flashcards, move flashcards around - live your life to the fullest!
          </div>
        );
      case 'memcode_added_some_feature':
        return this.renderNotification(
          notification,
          <i className="fa fa-bullhorn" style={{ fontSize: 21, color: 'rgb(255, 63, 0)' }}/>,
          'We added some feature!',
          <div dangerouslySetInnerHTML={{ __html: notification.content.html }}/>
        );
      case 'someone_started_learning_your_course':
        return this.renderNotification(
          notification,
          <i className="fa fa-user-plus" style={{ fontSize: 21, color: 'rgb(34, 59, 119)' }}/>,
          'Someone started learning your course!',
          <div>
            <span className="learner-username">{notification.content.learnerUsername} </span>
            joined
            <Link to="/courses/${courseId}/edit"> {notification.content.courseTitle}</Link>
          </div>
        );
      default: {
        console.error(`Your notification is of type ${notification.type}, and we don't know how to render it.`);
        return null;
      }
    }
  }

  getAmountOfUnreadNotifications = () =>
    this.state.speGetNotifications.payload.filter((notification) => !notification.ifRead).length

  ifThereAreUnreadNotifications = () =>
    this.state.speGetNotifications.status === 'success' &&
    this.getAmountOfUnreadNotifications() > 0

  renderToggler = () =>
    <div
      className="toggler"
      style={disableOnSpeRequest(this.state.speGetNotifications)}
      onClick={() => this.setState({ ifDropdownIsOpen: !this.state.ifDropdownIsOpen })}
    >
      <i className="fa fa-bell"/>
      {
        this.ifThereAreUnreadNotifications() &&
        <div className="amount-of-notifications">{this.getAmountOfUnreadNotifications()}</div>
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

  render = () =>
    <section
      className={`
        notifications-toggler-and-dropdown
        ${css.section}
        ${this.state.ifDropdownIsOpen ? '-dropdown-is-open' : '-dropdown-is-closed'}
        ${this.ifThereAreUnreadNotifications() ? '-there-are-unread-notifications' : '-there-are-no-unread-notifications'}
      `}
    >
      {this.renderToggler()}
      <Loading enabledStatuses={['success']} spe={this.state.speGetNotifications}>{(notifications) =>
        <div className="dropdown standard-dropdown-with-arrow" style={{ display: this.state.ifDropdownIsOpen ? 'block' : 'none' }}>
          {this.renderDropdownHeader()}
          <ul className="notifications">
            {notifications.map(this.renderNotificationLi)}
          </ul>
        </div>
      }</Loading>
    </section>
}

export default NotificationsTogglerAndDropdown;
