import TogglerAndModal from '~/components/TogglerAndModal';
import css from './index.scss';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { orderBy } from 'lodash';
import getUserAvatar from '~/services/getUserAvatar';

class StatsModal extends React.Component {
  static propTypes = {
    toggler: PropTypes.element.isRequired,
    course: PropTypes.object.isRequired,
    stats: PropTypes.array.isRequired,
    remainingStudents: PropTypes.number,
    currentUser: PropTypes.object.isRequired,
    author: PropTypes.object.isRequired
  }

  getStats = () => {
    return orderBy(this.props.stats, (user) => user.lastReviewedAt ? dayjs(user.lastReviewedAt).unix() : 0, 'desc');
  }

  renderTable = () =>
    <table className="standard-table">
      <thead>
        <tr>
          <th>Username</th>
          <th>Last reviewed</th>
          <th>Learned flashcards</th>
          <th>Easiness average</th>
        </tr>
      </thead>

      <tbody>
        {this.getStats().map((user) =>
          <tr key={user.id}>
            <td className="user">

              <Link className="button -clear -fade-out-on-hover" to={`/users/${user.id}`}>
                <img src={getUserAvatar(user)} alt="User avatar"/>
                <div className="username">{user.username}</div>
              </Link>

            </td>

            {
              user.lastReviewedAt !== undefined ?
                <td>{dayjs(user.lastReviewedAt).from(dayjs(), true)} ago</td> :
                <td>-</td>
            }
            <td>{user.learnedFlashcards}/{user.totalFlashcards}</td>
            <td>{user.easinessMean.toFixed(2)}</td>
          </tr>
        )}
      </tbody>
    </table>

  render = () =>
    <TogglerAndModal toggler={this.props.toggler}>{() =>
      <section className={"standard-modal standard-modal--md " + css.modal}>
        <div className="standard-modal__header">
          <h2 className="standard-modal__title">Students statistics</h2>
        </div>

        <div className="standard-modal__main">
          <div className="table-wrapper">
            {this.renderTable()}
            {this.props.remainingStudents > 0 &&
              <div className="remaining-students-note">
                ... and {this.props.remainingStudents} more students
              </div>
            }
          </div>
        </div>
      </section>
    }</TogglerAndModal>
}

export default StatsModal;
