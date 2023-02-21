import UserSelect from '~/appComponents/UserSelect';
import api from '~/api';
import CreateGroupModal from './components/CreateGroupModal';
import Loading from '~/components/Loading';

import css from './index.scss';

class OrganizeStudentsTab extends React.Component {
  static propTypes = {
  }

  state = {
    speStudentGroups: {},
    selectedGroupId: null
  }

  componentDidMount = () => {
    api.StudentGroupApi.getAll(
      (spe) => this.setState({ speStudentGroups: spe })
    )
      .then(({ studentGroups }) => {
        if (studentGroups[0]) {
          this.setState({ selectedGroupId: studentGroups[0].id })
        }
      })
  }

  uiCreateStudentGroup = (studentGroup) => {
    const spe = this.state.speStudentGroups;

    this.setState({
      speStudentGroups: {
        ...spe,
        payload: {
          ...spe.payload,
          studentGroups: [studentGroup, ...spe.payload.studentGroups]
        }
      }
    });
  }

  render = () =>
    <Loading spe={this.state.speStudentGroups}>{({ studentGroups, students }) =>
      <div className={css.local}>
        <div className="left">
          <CreateGroupModal
            toggler={<button type="button" className="button -white">Create group</button>}
            uiCreateStudentGroup={this.uiCreateStudentGroup}
          />

          <ul className="groups">
            {studentGroups.map((group) =>
              <li
                className={`group ${this.state.selectedGroupId === group.id ? '-active' : ''}`}
                key={group.id}
              >
                <button type="button" className="button -clear" onClick={() => this.setState({ selectedGroupId: group.id })}>
                  {group.title}
                </button>
              </li>
            )}
          </ul>
        </div>

        <div className="right">

          <UserSelect onSelect={() => {}} placeholder="Add students..."/>

          <ul className="students">
            {students.map((student) =>
              <li key={student.id}>{student.username}</li>
            )}
          </ul>
        </div>
      </div>
    }</Loading>
}

export default OrganizeStudentsTab;
