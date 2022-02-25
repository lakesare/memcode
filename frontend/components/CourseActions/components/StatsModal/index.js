import TogglerAndModal from '~/components/TogglerAndModal';
import css from './index.scss';
import { Link }        from 'react-router-dom';
import dayjs from 'dayjs';

class StatsModal extends React.Component {
  static propTypes = {
    toggler: PropTypes.element.isRequired,
    course: PropTypes.object.isRequired,
    stats: PropTypes.array.isRequired,
    currentUser: PropTypes.object.isRequired,
    author: PropTypes.object.isRequired
  }

  renderTable = () =>
    <table className="standard-table">
      <thead>
        <tr>
          <th>Username</th>
          <th>Last time course was reviewed</th>
          <th>Learned flashcards</th>
          <th>Easiness average</th>
        </tr>
        
      </thead>

      <tbody>
        {this.props.stats.map((user) =>
          <tr key={user.id}>
            <td className="user">

            <Link to={`/users/${user.id}`}>
              <img src={user.avatarUrl} alt="Coauthor avatar"/>
            </Link>
            <div className="username">{user.username}</div>
    
            </td>

            {user.lastReviewedAt !== undefined ? <td>{dayjs(user.lastReviewedAt).from(dayjs(), true)} ago</td>:<td>Not reviewed yet</td>} 
            <td>{user.learnedFlashcards}/{user.totalFlashcards}</td>
            <td>{user.easinessMean.toFixed(2)}</td>

          </tr>
        )}
      </tbody>
    </table>

  render = () =>
    <TogglerAndModal toggler={this.props.toggler}>{(closeModal) =>
      <section className={"standard-modal standard-modal--md " + css.modal}>
        <div className="standard-modal__header">
          <h2 className="standard-modal__title">Students statistics</h2>
        </div>

        <div className="standard-modal__main">

          <div className="table-wrapper">
            {this.renderTable()}
          </div>
        
        </div>
      </section>
    }</TogglerAndModal>
}

export default StatsModal;
