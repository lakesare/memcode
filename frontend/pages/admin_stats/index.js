import api from '~/api';

import Loading from '~/components/Loading';
import PageAdmin from '~/appComponents/PageAdmin';

import css from './index.scss';

class Page extends React.Component {
  state = {
    speGetStats: {},
    stats: null,
    showAllMonths: false,
    expandedFlashcards: new Set(),
    showAllReviews: false
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

  formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const time = date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    return `${year}, ${month} ${day}, ${time}`;
  }

  extractTextContent = (htmlContent) => {
    if (!htmlContent) return '';
    // Handle JSON content structure
    if (typeof htmlContent === 'object' && htmlContent.content) {
      htmlContent = htmlContent.content;
    }
    if (typeof htmlContent === 'string') {
      // Remove HTML tags and decode entities
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      return tempDiv.textContent || tempDiv.innerText || '';
    }
    return String(htmlContent);
  }

  formatFlashcardTooltip = (problemContent) => {
    if (!problemContent) return '';
    
    // Handle JSON content structure for flashcards
    let content = problemContent;
    if (typeof content === 'object') {
      if (content.content && content.answer) {
        // separateAnswer type flashcard
        const questionText = this.extractTextContent(content.content);
        const answerText = this.extractTextContent(content.answer);
        return `${questionText}\n__________________________\n${answerText}`;
      } else if (content.content && content.explanation) {
        // inlinedAnswers type flashcard
        const questionText = this.extractTextContent(content.content);
        const explanationText = this.extractTextContent(content.explanation);
        return `${questionText}\n__________________________\n${explanationText}`;
      } else if (content.content) {
        // Other types - just show content
        return this.extractTextContent(content.content);
      }
    }
    
    // Fallback for string content
    return this.extractTextContent(content);
  }

  truncateContent = (content, maxLength) => {
    const textContent = this.extractTextContent(content);
    if (textContent.length <= maxLength) {
      return textContent;
    }
    return textContent.substring(0, maxLength) + '...';
  }

  toggleFlashcardExpansion = (reviewIndex) => {
    const newExpanded = new Set(this.state.expandedFlashcards);
    if (newExpanded.has(reviewIndex)) {
      newExpanded.delete(reviewIndex);
    } else {
      newExpanded.add(reviewIndex);
    }
    this.setState({ expandedFlashcards: newExpanded });
  }

  isFlashcardExpanded = (reviewIndex) => {
    return this.state.expandedFlashcards.has(reviewIndex);
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

  renderRecentReviewsSection = () => {
    const { recentReviews } = this.state.stats;
    const { showAllReviews } = this.state;
    
    // Show only first 20 reviews by default
    const displayReviews = showAllReviews ? recentReviews : recentReviews.slice(0, 20);
    const hasMoreReviews = recentReviews.length > 20;
    
    return (
      <section className="standard-admin-section">
        <h2 className="standard-admin-section-title">Recent Flashcard Reviews (Last 300)</h2>
        
        <div className="timelineContainer">
          <table className="dataTable timelineTable">
            <thead>
              <tr>
                <th>Time & Date</th>
                <th>User</th>
                <th>Course</th>
                <th>Flashcard Content</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {displayReviews.map((review, index) => (
                <tr key={index}>
                  <td className="timeCell">{this.formatDateTime(review.reviewedAt)}</td>
                  <td className="userCell">
                    <a href={`/users/${review.userId}`} target="_blank" rel="noopener noreferrer">
                      {review.username}
                    </a>
                  </td>
                  <td className="courseCell">
                    <a href={`/courses/${review.courseId}`} target="_blank" rel="noopener noreferrer">
                      {review.courseTitle}
                    </a>
                  </td>
                  <td className="contentCell">
                    <div 
                      className={`flashcardContent ${this.isFlashcardExpanded(index) ? 'expanded' : 'collapsed'}`}
                      onClick={() => this.toggleFlashcardExpansion(index)}
                    >
                      {this.isFlashcardExpanded(index) ? (
                        <div className="fullContent">
                          {this.formatFlashcardTooltip(review.problemContent).split('\n').map((line, lineIndex) => (
                            <div key={lineIndex}>
                              {line === '__________________________' ? (
                                <hr className="flashcardDivider" />
                              ) : (
                                line || <br />
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="truncatedContent">
                          {this.truncateContent(review.problemContent, 100)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="resultCell">
                    <span className={`reviewResult ${review.wasCorrect ? 'correct' : 'incorrect'}`}>
                      {review.wasCorrect ? '✓' : '✗'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {hasMoreReviews && (
            <div className="showMoreContainer">
              <button 
                className="showMoreButton" 
                onClick={() => this.setState({ showAllReviews: !showAllReviews })}
              >
                {showAllReviews ? `Show Less (Show only 20)` : `Show More (${recentReviews.length - 20} more reviews)`}
              </button>
            </div>
          )}
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
                {this.renderTopUsersSection()}
                {this.renderRecentReviewsSection()}
              </>
          )}
        </Loading>
      </div>
    </PageAdmin>
}

export default Page;