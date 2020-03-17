import TogglerAndModal from '~/components/TogglerAndModal';
import css from './index.scss';
import UserSelect from '~/appComponents/UserSelect';

class InviteCoauthorModal extends React.Component {
  static propTypes = {
    toggler: PropTypes.element.isRequired,
    course: PropTypes.object.isRequired,
    // uiUpdateCourse: PropTypes.func.isRequired,
  }

  state = {
    selectedTab: 'Course Details'
  }

  // onSelectUser = () =>

  render = () =>
    <TogglerAndModal toggler={this.props.toggler}>{() =>
      <section className={"standard-modal " + css.modal}>
        <div className="standard-modal__header">
          <h2 className="standard-modal__title">Invite Coauthors</h2>
        </div>

        <div className="standard-modal__main">
          <p>Add another Memcode user as a coauthor, learning together with someone special is more fun!</p>

          <UserSelect
            onSelect={this.onSelectUser}
          />

          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Username</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td></td>
              </tr>
            </tbody>
          </table>



        </div>
      </section>
    }</TogglerAndModal>
}

export default InviteCoauthorModal;
