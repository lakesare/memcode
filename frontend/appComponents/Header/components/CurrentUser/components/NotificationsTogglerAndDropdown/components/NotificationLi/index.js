import humanizePostgresInterval from '~/services/humanizePostgresInterval';

import { Link } from 'react-router-dom';

import css from './index.css';

class NotificationLi extends React.Component {
  static propTypes = {
    notification: PropTypes.object.isRequired,
    apiMarkAsReadOrUnread: PropTypes.func.isRequired
  }

  renderLi = (notification, icon, title, content) =>
    <li
      className={`
        ${css.li}
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
        onClick={() => this.props.apiMarkAsReadOrUnread(notification, !notification.ifRead)}
      ><div className="circle"/></button>
    </li>

  // Love it hate it but you did it!
  render = () => {
    const notification = this.props.notification;
    // notification.type = 'welcome_to_memcode';
    switch (notification.type) {
      case 'welcome_to_memcode':
        return this.renderLi(
          notification,
          <i className="fa fa-heart" style={{ fontSize: 21, color: 'rgb(212, 4, 236)' }}/>,
          'Welcome to Memcode!',
          <div>
            Create flashcards, review flashcards, move flashcards around - live your life to the fullest!
          </div>
        );
      case 'memcode_added_some_feature':
        return this.renderLi(
          notification,
          // fa-font-awesome - флажок
          // bullhorn - this would suit a blog post
          // flask
          // bolt
          <i className="fa fa-flask" style={{ fontSize: 21, color: 'rgb(212, 4, 236)' }}/>,
          'We added a new feature',
          <div dangerouslySetInnerHTML={{ __html: notification.content.html }}/>
        );
      case 'someone_started_learning_your_course':
        return this.renderLi(
          notification,
          <i className="fa fa-user-plus" style={{ fontSize: 21, color: 'white' }}/>,
          'Someone started learning your course!',
          <div>
            <span className="learner-username">{notification.content.learnerUsername} </span>
            joined
            <Link to={`/courses/${notification.content.courseId}`}> {notification.content.courseTitle}</Link>
          </div>
        );
      case 'someone_rated_your_course':
        return this.renderLi(
          notification,
          <i className="fa fa-star" style={{ fontSize: 21, color: 'rgb(136, 125, 220)' }}/>,
          'Someone rated your course!',
          <div>
            <span className="rater-username">{notification.content.raterUsername} </span>
            gave
            <Link to={`/courses/${notification.content.courseId}`}> {notification.content.courseTitle} </Link>
            {notification.content.rating} stars!
          </div>
        );
      case 'someone_added_you_as_coauthor':
        return this.renderLi(
          notification,
          <i className="fa fa-paw" style={{ fontSize: 21, color: 'rgb(248, 156, 43)' }}/>,
          'Someone wants to collaborate with you!',
          <div>
            <span className="text-orange">{notification.content.author.username} </span>
            invites you to edit their course:
            <Link to={`/courses/${notification.content.course.id}`}> {notification.content.course.title}</Link>.
          </div>
        );

      default: {
        console.error(`Your notification is of type '${notification.type}', and we don't know how to render it.`);
        return null;
      }
    }
  }
}

export default NotificationLi;
