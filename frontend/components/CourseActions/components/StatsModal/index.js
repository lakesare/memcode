import TogglerAndModal from '~/components/TogglerAndModal';
import css from './index.scss';
import { Link }        from 'react-router-dom';
import api from '~/api';

class StatsModal extends React.Component {
  static propTypes = {
    toggler: PropTypes.element.isRequired,
    course: PropTypes.object.isRequired,
    learners: PropTypes.array.isRequired,
    currentUser: PropTypes.object.isRequired,
    author: PropTypes.object.isRequired
  }

  state = {
    learners: this.props.learners,
    stats: [],
    speUpdate: {}
  }

  getStats = () =>
    api.CourseApi.getStudentsStats(
      (spe) => spe.status === 'success',
      { courseId: this.props.course.id, authorId: this.props.author.id }
    )
    .then((payload) => {
      this.state.stats = []

      for (let index = 0; index < payload.length; index++) {
        const element = payload[index];
        const merged = { ...this.state.learners[index], ...element };
        this.state.stats.push(merged)
      }
    })

  getStudentsStats = () => {
    this.getStats();
  }

  renderTable = () =>
    <table className="standard-table">
      {this.getStudentsStats()}
      <thead>
        <tr>
          <th>Username</th>
          <th>Last time course was reviewed</th>
          <th>Learned flashcards</th>
          <th>Easiness average</th>
        </tr>
        
      </thead>

      <tbody>
        {this.state.stats.map((user) =>
          <tr key={user.id}>
            <td className="user">

            <Link to={`/users/${user.id}`}>
              <img src={user.avatarUrl} alt="Coauthor avatar"/>
            </Link>
            <div className="username">{user.username}</div>
    
            </td>

            <td>{new Date(user.lastReviewedAt).toUTCString()}</td>
            <td>{user.learnedFlashcards}/{user.totalFlashcards}</td>
            <td>{user.easinessMean}</td>

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
