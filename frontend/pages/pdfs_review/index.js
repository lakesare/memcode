import { Link } from 'react-router';
import withRouter from '~/services/withRouter';
import api from '~/api';
import PdfReader from '~/appComponents/PdfReader';

import css from './index.scss';

// [claude comment] goes through due bookmarks one by one: the book opens at the bookmark, and you can read around it as much as you need
class Page_pdfs_review extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired
  }

  state = {
    status: 'loading',
    queue: [],
    index: 0,
    nOfUnderstood: 0,
    ifAhead: false
  }

  componentDidMount = () => {
    this.loadQueue(false);
  }

  pdfIdFilter = () => new URLSearchParams(this.props.location.search).get('pdfId')

  loadQueue = (ifAhead) => {
    this.setState({ status: 'loading' });
    const pdfId = this.pdfIdFilter();
    api.get.PdfApi.getBookmarksToReview(false, { ifAhead, ...(pdfId ? { pdfId } : {}) })
      .then((queue) => this.setState({ status: 'success', queue, index: 0, ifAhead }))
      .catch(() => this.setState({ status: 'failure' }));
  }

  review = (outcome) => {
    const bookmark = this.state.queue[this.state.index];
    api.post.PdfApi.reviewBookmark(false, { bookmarkId: bookmark.id, outcome })
      .catch(() => this.setState({ error: "Couldn't save that review - check your connection." }));
    if (outcome === 'understood' && this.reader) this.reader.removeBookmarkLocally(bookmark.id);
    this.setState((state) => ({
      index: state.index + 1,
      nOfUnderstood: state.nOfUnderstood + (outcome === 'understood' ? 1 : 0)
    }));
  }

  goodIntervalLabel = (bookmark) => {
    const days = bookmark.nOfReviews === 0 ? 3 : Math.max(3, Math.round(bookmark.intervalDays * 2.5));
    return `${days}d`;
  }

  renderFooter = (bookmark) =>
    <div className={css.footer}>
      <div className="where">
        <span className="mini-ribbon"/>
        <span className="title">{bookmark.pdfTitle}</span>
        <span className="page">p. {bookmark.page}</span>
        <span className="count">{this.state.index + 1} of {this.state.queue.length}</span>
      </div>
      <div className="buttons">
        <button type="button" className="again" onClick={() => this.review('again')}>
          Not yet <span className="interval">1d</span>
        </button>
        <button type="button" className="good" onClick={() => this.review('good')}>
          Getting there <span className="interval">{this.goodIntervalLabel(bookmark)}</span>
        </button>
        <button type="button" className="understood" onClick={() => this.review('understood')}>
          Understood — remove bookmark
        </button>
      </div>
      {this.state.error && <div className="error">{this.state.error}</div>}
    </div>

  renderDone = () =>
    <div className={css.done}>
      <div className="card">
        {
          this.state.status === 'loading' ? <p>Loading…</p> :
          this.state.status === 'failure' ? <p>Couldn't load your bookmarks - check your connection.</p> :
          <>
            <h2>{this.state.queue.length === 0 ? 'Nothing is due' : 'All due places reviewed'}</h2>
            {
              this.state.queue.length > 0 &&
              <p>{this.state.queue.length} {this.state.queue.length === 1 ? 'place' : 'places'} reviewed, {this.state.nOfUnderstood} bookmark{this.state.nOfUnderstood === 1 ? '' : 's'} taken out.</p>
            }
            <div className="actions">
              <Link to="/pdfs" className="primary">Back to library</Link>
              {!this.state.ifAhead && <button type="button" onClick={() => this.loadQueue(true)}>Review ahead</button>}
            </div>
          </>
        }
      </div>
    </div>

  render = () => {
    const bookmark = this.state.status === 'success' ? this.state.queue[this.state.index] : null;
    if (bookmark) {
      return <PdfReader
        key={bookmark.pdfId}
        ref={(el) => this.reader = el}
        pdfId={bookmark.pdfId}
        backTo="/pdfs"
        focus={{ page: bookmark.page, y: bookmark.y, bookmarkId: bookmark.id, key: bookmark.id }}
        footer={this.renderFooter(bookmark)}
      />;
    } else {
      return this.renderDone();
    }
  }
}

export default withRouter(Page_pdfs_review);
