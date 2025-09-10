import api from '~/api';

import Loading from '~/components/Loading';
import PageAdmin from '~/appComponents/PageAdmin';
import UserSelect from '~/appComponents/UserSelect';
import getUserAvatar from '~/services/getUserAvatar';

import css from './index.scss';

class Page extends React.Component {
  state = {
    selectedUser: null,
    userStats: null,
    speDeleteUser: {},
    speGetStats: {},
    deleteConfirmation: '',
    deletionSuccess: null
  }

  onSelectUser = (user) => {
    this.setState({ 
      selectedUser: user, 
      deleteConfirmation: '',
      userStats: null,
      deletionSuccess: null
    });
    
    // Fetch user deletion stats
    this.fetchUserStats(user.id);
  }

  fetchUserStats = (userId) => {
    api.get.AdminApi.getUserDeletionStats(
      (spe) => this.setState({ speGetStats: spe }),
      { userId }
    ).then((response) => {
      this.setState({ userStats: response });
    });
  }

  apiDeleteUser = () => {
    if (!this.state.selectedUser) {
      return;
    }

    if (this.state.deleteConfirmation !== 'DELETE') {
      return;
    }

    const deletedUsername = this.state.selectedUser.username;

    api.post.AdminApi.deleteUser(
      (spe) => this.setState({ speDeleteUser: spe }),
      {
        userId: this.state.selectedUser.id
      }
    ).then(() => {
      this.setState({
        deletionSuccess: {
          username: deletedUsername,
          timestamp: new Date()
        },
        deleteConfirmation: ''
      });
    });
  }

  renderCoursesSection = () => {
    if (!this.state.userStats || !this.state.userStats.courses) {
      return null;
    }

    const courses = this.state.userStats.courses;
    
    if (courses.length === 0) {
      return (
        <div className="coursesSection">
          <details className="coursesDetails">
            <summary className="coursesSummary">
              <strong>Courses Created (0)</strong>
            </summary>
            <p className="noCourses">This user has not created any courses.</p>
          </details>
        </div>
      );
    }

    return (
      <div className="coursesSection">
        <details className="coursesDetails">
          <summary className="coursesSummary">
            <strong>Courses Created ({courses.length}) - Click to view details</strong>
          </summary>
          
          <div className="coursesTableWrapper">
            <table className="coursesTable">
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Visibility</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id}>
                    <td className="courseTitle">{course.title}</td>
                    <td className="courseVisibility">
                      <span className={`visibilityBadge ${course.ifPublic ? 'public' : 'private'}`}>
                        {course.ifPublic ? 'Public' : 'Private'}
                      </span>
                    </td>
                    <td className="courseDate">
                      {new Date(course.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    );
  }

  renderSelectedUserSection = () => {
    if (!this.state.selectedUser) {
      return null;
    }

    const user = this.state.selectedUser;
    const stats = this.state.userStats?.stats;
    const isDeleteReady = this.state.deleteConfirmation === 'DELETE';
    const isLoadingStats = this.state.speGetStats.status === 'loading';

    return (
      <div className="selectedUserSection">
        <h3>Selected User</h3>
        <div className="userTableWrapper">
          <table className="userTable">
            <thead>
              <tr>
                <th className="userTableHeader">Avatar</th>
                <th className="userTableHeader">Username</th>
                <th className="userTableHeader">ID</th>
                <th className="userTableHeader">Created</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="userTableValue">
                  <img src={getUserAvatar(user)} alt={`${user.username}'s avatar`} className="userAvatar" />
                </td>
                <td className="userTableValue">
                  <a href={`/users/${user.id}`} target="_blank" rel="noopener noreferrer" className="userProfileLink">
                    {user.username}
                  </a>
                </td>
                <td className="userTableValue">{user.id}</td>
                <td className="userTableValue">
                  {new Date(user.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {isLoadingStats && (
          <div className="loadingStats">
            <Loading spe={this.state.speGetStats}>Loading user statistics...</Loading>
          </div>
        )}

        {stats && this.renderCoursesSection()}

        <div className="dangerZone">
          <h4>⚠️ Danger Zone</h4>
          <p className="warningText">
            This will permanently delete <strong>{user.username}</strong> and ALL their related data:
          </p>
          
          <div className="statsTableWrapper">
            <table className="statsTable">
              <thead>
                <tr>
                  <th>Data Type</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Courses created</td>
                  <td className="statsCount">
                    {stats ? (this.state.userStats?.courses?.length || 0) : <span className="loading">loading...</span>}
                  </td>
                </tr>
                <tr>
                  <td>Problems created</td>
                  <td className="statsCount">
                    {stats ? (stats.problemsCount || 0) : <span className="loading">loading...</span>}
                  </td>
                </tr>
                <tr>
                  <td>Courses user is learning</td>
                  <td className="statsCount">
                    {stats ? (stats.learningProgressCount || 0) : <span className="loading">loading...</span>}
                  </td>
                </tr>
                <tr>
                  <td>Problems user is learning</td>
                  <td className="statsCount">
                    {stats ? (stats.problemLearningProgressCount || 0) : <span className="loading">loading...</span>}
                  </td>
                </tr>
                <tr>
                  <td>User notifications</td>
                  <td className="statsCount">
                    {stats ? (stats.notificationsCount || 0) : <span className="loading">loading...</span>}
                  </td>
                </tr>
                <tr>
                  <td>Coauthor relationships</td>
                  <td className="statsCount">
                    {stats ? (stats.coauthorCount || 0) : <span className="loading">loading...</span>}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="confirmationSection">
            <label htmlFor="deleteConfirmation">
              Type <strong>DELETE</strong> to confirm:
            </label>
            <input
              id="deleteConfirmation"
              type="text"
              value={this.state.deleteConfirmation}
              onChange={(e) => this.setState({ deleteConfirmation: e.target.value })}
              placeholder="Type DELETE here"
              className="confirmationInput"
            />
          </div>

          <button
            className="button -red"
            onClick={this.apiDeleteUser}
            disabled={!isDeleteReady}
            style={{ opacity: isDeleteReady ? 1 : 0.1 }}
          >
            DELETE USER PERMANENTLY
          </button>

          <Loading spe={this.state.speDeleteUser}>
            {({ message }) => <span className="loadingMessage">{message}</span>}
          </Loading>
        </div>
      </div>
    );
  }

  render = () =>
    <PageAdmin title="Users">
      <div className={css.adminUsersPage}>
        <div className={`standard-admin-sections sections`}>
          <section className="standard-admin-section">
            <h2 className="standard-admin-section-title">Delete User</h2>
            
            <div className="description">
              Select a user to permanently delete them and all their associated data.
              <strong> This action cannot be undone.</strong>
            </div>


            <div className="userSelectSection">
              <label htmlFor="userSelect">Find user to delete:</label>
              <div id="userSelect">
                <UserSelect
                  onSelect={this.onSelectUser}
                  placeholder="Search by username or email..."
                />
              </div>
            </div>

            {this.renderSelectedUserSection()}
          </section>
        </div>
        
        {this.state.deletionSuccess && (
          <div className="bottomSuccessNotification">
            <h3>✅ User Deleted Successfully</h3>
            <p>
              User <strong>{this.state.deletionSuccess.username}</strong> and all their related data have been permanently deleted.
            </p>
            <p className="timestamp">
              Deleted at {this.state.deletionSuccess.timestamp.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </p>
          </div>
        )}
      </div>
    </PageAdmin>
}

export default Page;
