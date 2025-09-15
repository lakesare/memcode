import TogglerAndModal from '~/components/TogglerAndModal';
import Loading from '~/components/Loading';
import css from './index.scss';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { orderBy } from 'lodash';
import getUserAvatar from '~/services/getUserAvatar';
import api from '~/api';

class StatsModal extends React.Component {
  static propTypes = {
    toggler: PropTypes.element.isRequired,
    course: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    author: PropTypes.object.isRequired
  }

  state = {
    speGetStats: {}
  }

  getStats = () => {
    api.get.CourseApi.getStudentsStats(
      (speGetStats) => this.setState({ speGetStats }),
      { courseId: this.props.course.id, authorId: this.props.author.id }
    );
  }

  getSortedStats = (stats) => {
    return orderBy(stats, (user) => user.lastReviewedAt ? dayjs(user.lastReviewedAt).unix() : 0, 'desc');
  }

  renderTable = (stats) =>
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
        {this.getSortedStats(stats.students).map((user) =>
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

  handleModalOpen = () => {
    // Load stats when modal opens if not already loaded/loading
    if (!this.state.speGetStats.status) {
      this.getStats();
    }
  }

  render = () =>
    <TogglerAndModal 
      toggler={this.props.toggler}
      afterOpen={this.handleModalOpen}
    >{() =>
      <section className={"standard-modal standard-modal--md " + css.modal}>
        <div className="standard-modal__header">
          <h2 className="standard-modal__title">Students statistics</h2>
        </div>

        <div className="standard-modal__main">
          <Loading spe={this.state.speGetStats}>{(stats) =>
            <div className="table-wrapper">
              {this.renderTable(stats)}
              {stats._remainingStudents > 0 &&
                <div className="remaining-students-note">
                  ... and {stats._remainingStudents} more students
                </div>
              }
            </div>
          }</Loading>
        </div>
      </section>
    }</TogglerAndModal>
}

export default StatsModal;
