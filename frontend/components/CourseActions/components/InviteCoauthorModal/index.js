import TogglerAndModal from '~/components/TogglerAndModal';
import css from './index.scss';
import UserSelect from '~/appComponents/UserSelect';
import api from '~/api';
import disableOnSpeRequest from '~/services/disableOnSpeRequest';
import Loading from '~/components/Loading';

// rgba(25, 26, 46, 0.27)
class InviteCoauthorModal extends React.Component {
  static propTypes = {
    toggler: PropTypes.element.isRequired,
    course: PropTypes.object.isRequired,
    coauthors: PropTypes.array.isRequired,
    currentUser: PropTypes.object.isRequired,
    author: PropTypes.object.isRequired
  }

  state = {
    coauthors: this.props.coauthors,
    speUpdate: {}
  }

  apiUpdateCoauthors = (closeModal) => {
    api.CourseApi.updateCoauthors(
      (spe) => this.setState({ speUpdate: spe }),
      {
        courseId: this.props.course.id,
        userIds: this.state.coauthors.map((user) => user.id)
      }
    )
      .then(() => {
        closeModal();
      });
  }

  onSelectUser = (user) => {
    this.setState({ coauthors: [...this.state.coauthors, user] });
  }

  uiRemoveCoauthor = (user) => {
    this.setState({
      coauthors: this.state.coauthors.filter((coauthor) =>
        coauthor.id !== user.id
      )
    });
  }

  renderTable = () =>
    <table className="standard-table">
      <thead>
        <tr>
          <th>Username</th>
          <th>Role</th>
          <th/>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td className="user">
            <img src={this.props.author.avatarUrl} alt="Coauthor avatar"/>
            <div className="username">{this.props.author.username}</div>
          </td>

          <td>Author</td>

          <td/>
        </tr>

        {this.state.coauthors.map((user) =>
          <tr key={user.id}>
            <td className="user">
              <img src={user.avatarUrl} alt="Coauthor avatar"/>
              <div className="username">{user.username}</div>
            </td>

            <td>Coauthor</td>

            <td>
              <button
                type="button"
                className="button -red-o -fade-out-on-hover"
                onClick={() => this.uiRemoveCoauthor(user)}
              >
                REMOVE
              </button>
            </td>
          </tr>
        )}
      </tbody>
    </table>

  render = () =>
    <TogglerAndModal toggler={this.props.toggler}>{(closeModal) =>
      <section className={"standard-modal standard-modal--md " + css.modal}>
        <div className="standard-modal__header">
          <h2 className="standard-modal__title">Invite Coauthors</h2>
          <div className="standard-modal__description">Add another Memcode user as a coauthor, learning together with someone special is more fun!</div>
        </div>

        <div className="standard-modal__main">
          <div className="label-and-select">
            <label>Find new coauthor:</label>

            <UserSelect
              onSelect={this.onSelectUser}
            />
          </div>

          <div className="table-wrapper">
            {this.renderTable()}
          </div>

          <Loading enabledStatuses={['failure']} spe={this.state.speUpdate}/>

          <button
            type="submit"
            className="button -purple standard-submit-button"
            onClick={() => this.apiUpdateCoauthors(closeModal)}
            style={disableOnSpeRequest(this.state.speUpdate, { opacity: 0.7 })}
          >
            SAVE
          </button>
        </div>
      </section>
    }</TogglerAndModal>
}

export default InviteCoauthorModal;
