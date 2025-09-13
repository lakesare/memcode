import api from '~/api';

import Loading from '~/components/Loading';
import PageAdmin from '~/appComponents/PageAdmin';

import css from './index.scss';

class Page extends React.Component {
  state = {
    speGetStats: {},
    stats: null
  }

  componentDidMount = () => {
    this.fetchStats();
  }

  fetchStats = () => {
    api.get.AdminApi.getStats(
      (spe) => this.setState({ speGetStats: spe }),
      {}
    ).then((response) => {
      this.setState({ stats: response });
    });
  }

  formatNumber = (num) => {
    return num.toLocaleString();
  }

  formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  }

  formatDayDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  getMonthName = (monthNumber) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1] || 'Unknown';
  }

  renderOverviewSection = () => {
    const { overview } = this.state.stats;
    
    return (
      <section className="standard-admin-section">
        <h2 className="standard-admin-section-title">Overview</h2>
        
        <div className="overviewGrid">
          <div className="statCard">
            <div className="statNumber">{this.formatNumber(overview.totalUsers)}</div>
            <div className="statLabel">Total Users</div>
          </div>
          
          <div className="statCard">
            <div className="statNumber">{this.formatNumber(overview.totalCourses)}</div>
            <div className="statLabel">Total Courses</div>
          </div>
          
          <div className="statCard">
            <div className="statNumber">{this.formatNumber(overview.totalProblems)}</div>
            <div className="statLabel">Total Flashcards</div>
          </div>
          
          <div className="statCard">
            <div className="statNumber">{this.formatNumber(overview.activeLearners)}</div>
            <div className="statLabel">Active Learners</div>
          </div>
          
          <div className="statCard">
            <div className="statNumber">{this.formatNumber(overview.totalLearningRelations)}</div>
            <div className="statLabel">Learning Relations</div>
          </div>
          
          <div className="statCard">
            <div className="statNumber">{this.formatNumber(overview.totalProblemLearningProgress)}</div>
            <div className="statLabel">Problem Learning Progress</div>
          </div>
          
        </div>
      </section>
    );
  }

  renderRecentActivitySection = () => {
    const { recentActivity } = this.state.stats;
    
    return (
      <section className="standard-admin-section">
        <h2 className="standard-admin-section-title">Recent Activity (Last 30 Days)</h2>
        
        <div className="activityGrid">
          <div className="activityCard">
            <div className="activityNumber">{this.formatNumber(recentActivity.newUsers30d)}</div>
            <div className="activityLabel">New Users</div>
          </div>
          
          <div className="activityCard">
            <div className="activityNumber">{this.formatNumber(recentActivity.newCourses30d)}</div>
            <div className="activityLabel">New Courses</div>
          </div>
          
          <div className="activityCard">
            <div className="activityNumber">{this.formatNumber(recentActivity.newProblems30d)}</div>
            <div className="activityLabel">New Flashcards</div>
          </div>
          
          <div className="activityCard">
            <div className="activityNumber">{this.formatNumber(recentActivity.newLearners30d)}</div>
            <div className="activityLabel">New Learners</div>
          </div>
        </div>
      </section>
    );
  }

  renderUserStatsSection = () => {
    const { userStats } = this.state.stats;
    
    return (
      <section className="standard-admin-section">
        <h2 className="standard-admin-section-title">User Registration Trends</h2>
        
        <div className="chartSection">
          <div className="registrationChart">
            <h3>User Registration by Month (Last 12 Months)</h3>
            <div className="chartContainer">
              <table className="dataTable">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>New Users</th>
                  </tr>
                </thead>
                <tbody>
                  {userStats.registrationByMonth.map((stat, index) => (
                    <tr key={index}>
                      <td>{this.formatDate(stat.month)}</td>
                      <td>{this.formatNumber(stat.count)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    );
  }

  renderCourseStatsSection = () => {
    const { courseStats } = this.state.stats;
    
    return (
      <section className="standard-admin-section">
        <h2 className="standard-admin-section-title">Course Statistics</h2>
        
        <div className="statsGrid">
          <div className="statsCard">
            <h3>Course Visibility</h3>
            <table className="dataTable">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {courseStats.visibilityBreakdown.map((stat, index) => (
                  <tr key={index}>
                    <td>{stat.isPublic ? 'Public' : 'Private'}</td>
                    <td>{this.formatNumber(stat.count)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="statsCard">
            <h3>Course Categories</h3>
            <table className="dataTable">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Courses</th>
                </tr>
              </thead>
              <tbody>
                {courseStats.categoryBreakdown.slice(0, 10).map((stat, index) => (
                  <tr key={index}>
                    <td>{stat.categoryName}</td>
                    <td>{this.formatNumber(stat.courseCount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }

  renderProblemStatsSection = () => {
    const { problemStats } = this.state.stats;
    
    return (
      <section className="standard-admin-section">
        <h2 className="standard-admin-section-title">Flashcard Statistics</h2>
        
        <div className="statsGrid">
          <div className="statsCard">
            <h3>Problem Types</h3>
            <table className="dataTable">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {problemStats.typeBreakdown.map((stat, index) => (
                  <tr key={index}>
                    <td>{stat.type}</td>
                    <td>{this.formatNumber(stat.count)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="statsCard">
            <h3>Flashcards Created by Month (All Years)</h3>
            <table className="dataTable">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {problemStats.creationByMonth.map((stat, index) => (
                  <tr key={index}>
                    <td>{this.getMonthName(stat.month)}</td>
                    <td>{this.formatNumber(stat.count)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="statsCard">
            <h3>Flashcards Created by Day (Last 30 Days)</h3>
            <div className="scrollableTable">
              <table className="dataTable">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {problemStats.creationByDay.map((stat, index) => (
                    <tr key={index}>
                      <td>{this.formatDayDate(stat.date)}</td>
                      <td>{this.formatNumber(stat.count)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="statsCard">
            <h3>Flashcards Reviewed by Month (All Years)</h3>
            <table className="dataTable">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Reviews</th>
                </tr>
              </thead>
              <tbody>
                {problemStats.reviewsByMonth.map((stat, index) => (
                  <tr key={index}>
                    <td>{this.getMonthName(stat.month)}</td>
                    <td>{this.formatNumber(stat.count)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="statsCard">
            <h3>Flashcards Reviewed by Day (Last 30 Days)</h3>
            <div className="scrollableTable">
              <table className="dataTable">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Reviews</th>
                  </tr>
                </thead>
                <tbody>
                  {problemStats.reviewsByDay.map((stat, index) => (
                    <tr key={index}>
                      <td>{this.formatDayDate(stat.date)}</td>
                      <td>{this.formatNumber(stat.count)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    );
  }

  renderRatingStatsSection = () => {
    const { ratingStats } = this.state.stats;
    
    if (ratingStats.breakdown.length === 0) {
      return null;
    }
    
    return (
      <section className="standard-admin-section">
        <h2 className="standard-admin-section-title">Course Ratings</h2>
        
        <div className="statsGrid">
          <div className="statsCard">
            <h3>Rating Distribution</h3>
            <table className="dataTable">
              <thead>
                <tr>
                  <th>Rating</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {ratingStats.breakdown.map((stat, index) => (
                  <tr key={index}>
                    <td>{stat.rating} ⭐</td>
                    <td>{this.formatNumber(stat.count)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {ratingStats.average && (
            <div className="statsCard">
              <h3>Average Rating</h3>
              <div className="avgRating">
                <span className="avgNumber">{ratingStats.average}</span>
                <span className="avgStars">⭐</span>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  renderTopUsersSection = () => {
    const { topUsers } = this.state.stats;
    
    return (
      <section className="standard-admin-section">
        <h2 className="standard-admin-section-title">Top Course Creators</h2>
        
        <div className="statsCard">
          <table className="dataTable">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Courses Created</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.courseCreators.map((creator, index) => (
                <tr key={creator.userId}>
                  <td>{index + 1}</td>
                  <td>
                    <a href={`/users/${creator.userId}`} target="_blank" rel="noopener noreferrer">
                      {creator.username}
                    </a>
                  </td>
                  <td>{this.formatNumber(creator.courseCount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }


  render = () =>
    <PageAdmin title="Admin Statistics">
      <div className={css.adminStatsPage}>
        <div className="standard-admin-sections sections">
          <Loading spe={this.state.speGetStats}>
            {this.state.stats && (
              <>
                {this.renderOverviewSection()}
                {this.renderRecentActivitySection()}
                {this.renderUserStatsSection()}
                {this.renderCourseStatsSection()}
                {this.renderProblemStatsSection()}
                {this.renderRatingStatsSection()}
                {this.renderTopUsersSection()}
              </>
            )}
          </Loading>
        </div>
      </div>
    </PageAdmin>
}

export default Page;