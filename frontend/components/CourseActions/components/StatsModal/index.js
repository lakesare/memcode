import TogglerAndModal from '~/components/TogglerAndModal';
import css from './index.scss';
import { Link }        from 'react-router-dom';

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
    speUpdate: {}
  }

  renderTable = () =>
    <table className="standard-table">
      <thead>
        <tr>
          <th>Username</th>
          <th>Last time course was reviewed</th>
          <th>Number of flashcards learned</th>
        </tr>
        
      </thead>

      <tbody>
        {this.state.learners.map((user) =>
          <tr key={user.id}>
            <td className="user">

            <Link to={`/users/${user.id}`}>
              <img src={user.avatarUrl} alt="Coauthor avatar"/>
            </Link>
            <div className="username">{user.username}</div>
    
            </td>

            <td>2022-02-12 10:49</td>
            <td>200000</td>

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
