import api from '~/api';

import Loading from '~/components/Loading';
import PageAdmin from '~/appComponents/PageAdmin';

import css from './index.scss';

class Page extends React.Component {
  state = {
    speGetStats: {},
    stats: null,
    showAllMonths: false
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

  formatYearMonth = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
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
          
          
        </div>
      </section>
    );
  }


  renderMonthlyStatsSection = () => {
    const { monthlyStats } = this.state.stats;
    const { showAllMonths } = this.state;
    
    // Show only last 12 months by default
    const displayStats = showAllMonths ? monthlyStats : monthlyStats.slice(0, 12);
    
    return (
      <section className="standard-admin-section">
        <h2 className="standard-admin-section-title">Monthly Activity Overview</h2>
        
        <div className="chartSection">
          <div className="registrationChart">
            <div className="chartHeader">
              <h3>Activity by Month (All Time)</h3>
              {monthlyStats.length > 12 && (
                <button 
                  className="expandButton" 
                  onClick={() => this.setState({ showAllMonths: !showAllMonths })}
                >
                  {showAllMonths ? 'Show Less' : `Show All (${monthlyStats.length} months)`}
                </button>
              )}
            </div>
            <div className="scrollableTable">
              <table className="dataTable">
                <thead>
                  <tr>
                    <th>Year Month</th>
                    <th>Users Created</th>
                    <th>Courses Created</th>
                    <th>Flashcards Created</th>
                    <th>Flashcards Reviewed</th>
                  </tr>
                </thead>
                <tbody>
                  {displayStats.map((stat, index) => (
                    <tr key={index}>
                      <td>{this.formatYearMonth(stat.month)}</td>
                      <td>{this.formatNumber(stat.usersCreated)}</td>
                      <td>{this.formatNumber(stat.coursesCreated)}</td>
                      <td>{this.formatNumber(stat.flashcardsCreated)}</td>
                      <td>
                        {stat.flashcardsReviewed > 0 ? (
                          this.formatNumber(stat.flashcardsReviewed)
                        ) : (
                          <span className="noData">—</span>
                        )}
                      </td>
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

  renderContentStatsSection = () => {
    const { courseStats, problemStats } = this.state.stats;
    
    return (
      <section className="standard-admin-section">
        <h2 className="standard-admin-section-title">Content Statistics</h2>
        
        <div className="statsGrid threeColumn">
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
      <div className={"standard-admin-sections sections " + css.adminStatsPage}>
        <Loading spe={this.state.speGetStats}>
          {this.state.stats && (
            <>
              {this.renderOverviewSection()}
              {this.renderMonthlyStatsSection()}
              {this.renderContentStatsSection()}
              {this.renderRatingStatsSection()}
              {this.renderTopUsersSection()}
            </>
          )}
        </Loading>
      </div>
    </PageAdmin>
}

export default Page;