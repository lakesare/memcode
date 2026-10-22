import api from '~/api';
import { loadPdf } from '~/services/pdf/loadPdf';
import PdfPlaces, { forgetSnapshots } from '~/components/PdfPlaces';

import css from './BookmarksModal.scss';

// [claude comment] a book's bookmarks opened from the library - loads the pdf (usually from the browser's cache) to draw the snapshots
class BookmarksModal extends React.Component {
  static propTypes = {
    pdfId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    onOpenInBook: PropTypes.func.isRequired,
    onBookmarkRemoved: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  }

  state = {
    status: 'loading',
    error: null,
    pdfjs: null,
    pdfDocument: null,
    highlights: [],
    bookmarks: []
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.onKeyDown);
    this.load();
  }

  componentWillUnmount = () => {
    this.unmounted = true;
    document.removeEventListener('keydown', this.onKeyDown);
    if (this.state.pdfDocument) forgetSnapshots(this.state.pdfDocument);
    if (this.loadingTask) this.loadingTask.destroy();
  }

  onKeyDown = (event) => {
    if (event.key === 'Escape' && this.state.status !== 'success') this.props.onClose();
  }

  load = async () => {
    try {
      const { pdf, highlights, bookmarks } = await api.get.PdfApi.getPdf(false, { pdfId: this.props.pdfId });
      const { pdfjs, pdfDocument, loadingTask } = await loadPdf(pdf.id, pdf.sizeBytes);
      this.loadingTask = loadingTask;
      if (this.unmounted) { loadingTask.destroy(); return; }
      this.setState({ status: 'success', pdfjs, pdfDocument, highlights, bookmarks });
    } catch (error) {
      if (!this.unmounted) this.setState({ status: 'failure', error: typeof error === 'string' ? error : (error.message || "Couldn't open this book") });
    }
  }

  removeBookmark = (bookmarkId) => {
    this.setState((state) => ({ bookmarks: state.bookmarks.filter((b) => b.id !== bookmarkId) }));
    api.post.PdfApi.removeBookmark(false, { bookmarkId })
      .then(this.props.onBookmarkRemoved)
      .catch(() => this.setState({ error: "Couldn't remove that bookmark - check your connection." }));
  }

  render = () => {
    if (this.state.status === 'success') {
      return <PdfPlaces
        pdfjs={this.state.pdfjs}
        pdfDocument={this.state.pdfDocument}
        highlights={this.state.highlights}
        bookmarks={this.state.bookmarks}
        title={this.props.title}
        ifAlwaysBig
        onSelect={(place) => this.props.onOpenInBook({ page: place.page, y: place.top, bookmarkId: place.bookmarks[0].id })}
        onRemoveBookmark={this.removeBookmark}
        onClose={this.props.onClose}
      />;
    } else {
      return <div className={css.loading} role="dialog" aria-label={`Bookmarks of ${this.props.title}`} onClick={this.props.onClose}>
        <div className="card" onClick={(event) => event.stopPropagation()}>
          <h3>{this.props.title}</h3>
          <p>{this.state.status === 'failure' ? this.state.error : 'Opening the book…'}</p>
        </div>
      </div>;
    }
  }
}

export default BookmarksModal;
