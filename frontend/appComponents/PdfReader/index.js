import { Link } from 'react-router';
import api from '~/api';
import { loadPdf } from '~/services/pdf/loadPdf';
import PdfViewer from '~/components/PdfViewer';
import PdfPlaces, { PlaceSnippet, groupIntoPlaces, preloadSnapshots, forgetSnapshots } from '~/components/PdfPlaces';
import icons from './icons';

import css from './index.scss';

const MARKER_COLORS = [
  { name: 'Red',   value: '#ff7b72' },
  { name: 'Green', value: '#6fd68a' },
  { name: 'Blue',  value: '#6aaeff' }
];

const readSetting = (key, fallback) => {
  try {
    const value = localStorage.getItem(`pdfs.${key}`);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
};
const writeSetting = (key, value) => {
  try { localStorage.setItem(`pdfs.${key}`, JSON.stringify(value)); } catch { /* private mode */ }
};

const newId = () => (
  window.crypto && crypto.randomUUID ?
    crypto.randomUUID() :
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    })
);

class PdfReader extends React.Component {
  static propTypes = {
    pdfId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    focus: PropTypes.object,
    footer: PropTypes.node,
    backTo: PropTypes.string,
    onBookmarkRemoved: PropTypes.func
  }

  state = {
    status: 'loading',
    progress: null,
    error: null,

    pdf: null,
    pdfjs: null,
    pdfDocument: null,
    pageSizes: [],
    highlights: [],
    bookmarks: [],

    color: MARKER_COLORS.some((c) => c.value === readSetting('color', null)) ? readSetting('color', null) : MARKER_COLORS[0].value,

    viewedPage: 1,
    currentPosition: null,
    focus: this.props.focus || null,
    ifPlacesOpen: false,
    ifColorMenuOpen: false,
    bookmarkPopover: null,
    toast: null,
    draft: null,
    savedPreview: null
  }

  componentDidMount = () => {
    this.load();
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.focus && (!prevProps.focus || prevProps.focus.key !== this.props.focus.key)) {
      this.setState({ focus: this.props.focus, bookmarkPopover: null });
    }
  }

  componentWillUnmount = () => {
    this.unmounted = true;
    clearTimeout(this.toastTimeout);
    clearTimeout(this.savedPreviewTimeout);
    clearTimeout(this.preloadTimeout);
    if (this.state.pdfDocument) forgetSnapshots(this.state.pdfDocument);
    if (this.loadingTask) this.loadingTask.destroy();
  }

  load = async () => {
    try {
      const { pdf, highlights, bookmarks } = await api.get.PdfApi.getPdf(false, { pdfId: this.props.pdfId });
      const { pdfjs, pdfDocument, pageSizes, loadingTask } = await loadPdf(pdf.id, pdf.sizeBytes, (loaded, total) => !this.unmounted && this.setState({ progress: { loaded, total } }));
      this.loadingTask = loadingTask;
      if (this.unmounted) { loadingTask.destroy(); return; }
      const currentPosition = { page: Math.min(pdf.currentPage, pageSizes.length), y: pdf.currentY };
      this.setState((state) => ({
        status: 'success', pdf, highlights, bookmarks, pdfjs, pdfDocument, pageSizes, currentPosition,
        focus: state.focus || { ...currentPosition, key: 'opened' }
      }));
      api.post.PdfApi.updatePdf(false, { pdfId: pdf.id, opened: true, nOfPages: pageSizes.length }).catch(() => {});
      this.preloadTimeout = setTimeout(() => preloadSnapshots(pdfjs, pdfDocument, this.state.highlights, this.state.bookmarks), 2000);
    } catch (error) {
      if (!this.unmounted) this.setState({ status: 'failure', error: typeof error === 'string' ? error : (error.message || 'Could not open this pdf') });
    }
  }

  showToast = (text) => {
    clearTimeout(this.toastTimeout);
    this.setState({ toast: text });
    this.toastTimeout = setTimeout(() => this.setState({ toast: null }), 5000);
  }

  saveFailed = () => this.showToast("Couldn't save that change - check your connection.")

  // ___tools
  selectColor = (color) => {
    writeSetting('color', color);
    this.setState({ color, ifColorMenuOpen: false });
  }

  // ___highlights
  pendingHighlightSaves = {}

  onCreateHighlight = (shape) => {
    const highlight = { id: newId(), pdfId: this.state.pdf.id, ...shape };
    this.setState((state) => ({
      highlights: [...state.highlights, highlight],
      draft: state.draft ? { highlightIds: [...state.draft.highlightIds, highlight.id] } : null
    }));
    const save = api.post.PdfApi.createHighlight(false, highlight).catch(this.saveFailed);
    this.pendingHighlightSaves[highlight.id] = save;
    save.finally(() => delete this.pendingHighlightSaves[highlight.id]);
  }

  onDeleteHighlight = (highlightId) => {
    this.setState((state) => ({
      highlights: state.highlights.filter((h) => h.id !== highlightId),
      draft: state.draft ? { highlightIds: state.draft.highlightIds.filter((id) => id !== highlightId) } : null
    }));
    api.post.PdfApi.deleteHighlight(false, { highlightId }).catch(this.saveFailed);
  }

  // ___bookmarks
  // [claude comment] "Bookmark" starts a draft: whatever you mark until "Save" is what this bookmark is about
  startDraft = () => {
    this.setState({ draft: { highlightIds: [] }, bookmarkPopover: null, ifPlacesOpen: false, savedPreview: null });
  }

  cancelDraft = () => {
    this.setState({ draft: null });
  }

  saveDraft = async () => {
    const ownHighlights = this.state.highlights.filter((h) => this.state.draft.highlightIds.includes(h.id));
    if (ownHighlights.length === 0) return;
    const page = ownHighlights[0].page;
    const pageHighlights = ownHighlights.filter((h) => h.page === page);
    const top = Math.min(...pageHighlights.map((h) => Math.min(...h.points.map((p) => p[1])) - h.width / 2));
    const bookmark = {
      id: newId(), pdfId: this.state.pdf.id, page, y: Math.max(0, top - 0.012),
      nextDueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    const highlightIds = pageHighlights.map((h) => h.id);

    this.setState((state) => ({
      draft: null,
      bookmarks: [...state.bookmarks, bookmark],
      highlights: state.highlights.map((h) => (highlightIds.includes(h.id) ? { ...h, bookmarkId: bookmark.id } : h))
    }), () => {
      const place = groupIntoPlaces(this.state.highlights, [bookmark])[0];
      this.setState({ savedPreview: place });
      clearTimeout(this.savedPreviewTimeout);
      this.savedPreviewTimeout = setTimeout(() => this.setState({ savedPreview: null }), 4000);
    });

    await Promise.all(highlightIds.map((id) => this.pendingHighlightSaves[id]).filter(Boolean));
    api.post.PdfApi.createBookmark(false, { id: bookmark.id, pdfId: bookmark.pdfId, page, y: bookmark.y, highlightIds }).catch(this.saveFailed);
  }

  onBookmarkClick = (bookmark, buttonEl) => {
    const rect = buttonEl.getBoundingClientRect();
    const rootRect = this.rootEl.getBoundingClientRect();
    this.setState({
      bookmarkPopover: {
        bookmark,
        top: rect.bottom - rootRect.top + 6,
        right: Math.max(8, rootRect.right - rect.right - 4)
      }
    });
  }

  removeBookmarkLocally = (bookmarkId) => {
    this.setState((state) => ({
      bookmarks: state.bookmarks.filter((b) => b.id !== bookmarkId),
      bookmarkPopover: null
    }));
  }

  removeBookmark = (bookmarkId) => {
    this.removeBookmarkLocally(bookmarkId);
    api.post.PdfApi.removeBookmark(false, { bookmarkId }).catch(this.saveFailed);
    if (this.props.onBookmarkRemoved) this.props.onBookmarkRemoved(bookmarkId);
  }

  // ___navigation
  onPageChange = (viewedPage) => {
    this.setState({ viewedPage });
  }

  // [claude comment] the reading position only moves when you say so - jumping around the book to look at highlights never loses it
  setAsCurrent = () => {
    const position = this.viewer.getPosition();
    this.setState({ currentPosition: position });
    api.post.PdfApi.updatePdf(false, { pdfId: this.state.pdf.id, currentPage: position.page, currentY: position.y }).catch(this.saveFailed);
  }

  backToCurrent = () => {
    this.setState({ focus: { ...this.state.currentPosition, key: `current-${Date.now()}` }, bookmarkPopover: null });
  }

  onSelectPlace = (place) => {
    this.setState({
      ifPlacesOpen: false,
      focus: { page: place.page, y: place.top, bookmarkId: place.bookmarks[0] ? place.bookmarks[0].id : null, key: `place-${place.key}-${Date.now()}` }
    });
  }

  renderToolbar = () =>
    <div className="toolbar">
      <div className="left">
        <Link to={this.props.backTo || '/pdfs'} className="icon-button back" aria-label="Back to library">{icons.back}</Link>
        <div className="title-and-page">
          <div className="title">{this.state.pdf ? `${this.state.pdf.title}.pdf` : ''}</div>
          {
            this.state.status === 'success' &&
            <div className="position">
              {
                this.state.viewedPage === this.state.currentPosition.page ?
                  <span className="position-control -here" title="Your reading position is on this page">
                    <span className="dot"/>Current page
                  </span> :
                  <span className="position-control">
                    <button type="button" className="back-to-current" onClick={this.backToCurrent} title="Jump back to your reading position">
                      {icons.back}Back to p. {this.state.currentPosition.page}
                    </button>
                    <button type="button" className="set-current" onClick={this.setAsCurrent} title="Move your reading position here">
                      Set p. {this.state.viewedPage} as current
                    </button>
                  </span>
              }
            </div>
          }
        </div>
      </div>

      <div className="center">
      <div className="tools">
        <span className="color-picker">
          <button
            type="button"
            className={`tool color-button ${this.state.ifColorMenuOpen ? '-open' : ''}`}
            onClick={() => this.setState((state) => ({ ifColorMenuOpen: !state.ifColorMenuOpen }))}
            aria-label="Marker colour"
            aria-expanded={this.state.ifColorMenuOpen}
            title="Marker colour"
          >
            <span className="swatch" style={{ background: this.state.color }}/>
            <svg viewBox="0 0 10 6" width="10" height="6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          {
            this.state.ifColorMenuOpen &&
            <span className="color-menu" role="menu">
              {MARKER_COLORS.map((color) =>
                <button
                  type="button"
                  role="menuitemradio"
                  key={color.value}
                  className={this.state.color === color.value ? '-active' : ''}
                  onClick={() => this.selectColor(color.value)}
                  aria-checked={this.state.color === color.value}
                >
                  <span className="swatch" style={{ background: color.value }}/>{color.name}
                </button>
              )}
            </span>
          }
        </span>
        <button
          type="button"
          className={`tool bookmark-button ${this.state.draft ? '-drafting' : ''}`}
          onClick={this.state.draft ? this.saveDraft : this.startDraft}
          disabled={!!this.state.draft && this.state.draft.highlightIds.length === 0}
          title={this.state.draft ? 'Save bookmark' : 'Bookmark'}
        >
          {icons.bookmark}
          <span className="label labels">
            <span className={this.state.draft ? '-hidden' : ''}>Bookmark</span>
            <span className={this.state.draft ? '' : '-hidden'}>Save</span>
          </span>
        </button>
      </div>

      {
        this.state.status === 'success' &&
        <div className="pager">
          <button type="button" className="icon-button" onClick={() => this.viewer && this.viewer.previousPage()} disabled={this.state.viewedPage <= 1} aria-label="Previous page" title="Previous page (←)">
            {icons.back}
          </button>
          <span className="page-number">{this.state.viewedPage} <span className="of">/ {this.state.pageSizes.length}</span></span>
          <button type="button" className="icon-button" onClick={() => this.viewer && this.viewer.nextPage()} disabled={this.state.viewedPage >= this.state.pageSizes.length} aria-label="Next page" title="Next page (→)">
            {icons.forward}
          </button>
        </div>
      }
      </div>

      <div className="right">
        <button
          type="button"
          className={`places-button ${this.state.ifPlacesOpen ? '-active' : ''} ${this.state.bookmarks.length > 0 ? '-has-count' : ''}`}
          onClick={() => this.setState((state) => ({ ifPlacesOpen: !state.ifPlacesOpen, bookmarkPopover: null }))}
          aria-expanded={this.state.ifPlacesOpen}
          disabled={this.state.status !== 'success'}
        >
          {icons.bookmark}
          <span className="label">All Bookmarks</span>
          {this.state.bookmarks.length > 0 && <span className="count">{this.state.bookmarks.length}</span>}
        </button>
      </div>

      {
        this.state.ifPlacesOpen &&
        <PdfPlaces
          pdfjs={this.state.pdfjs}
          pdfDocument={this.state.pdfDocument}
          highlights={this.state.highlights}
          bookmarks={this.state.bookmarks}
          currentPage={this.state.viewedPage}
          onSelect={this.onSelectPlace}
          onRemoveBookmark={this.removeBookmark}
          onClose={() => this.setState({ ifPlacesOpen: false })}
        />
      }
    </div>

  renderLoading = () => {
    const progress = this.state.progress;
    return <div className="loading">
      {
        this.state.status === 'failure' ?
          <p className="error">{this.state.error}</p> :
          <>
            <div className="bar"><div style={{ width: progress && progress.total ? `${100 * progress.loaded / progress.total}%` : '15%' }}/></div>
            <p>
              {
                progress && progress.total ?
                  `Downloading ${(progress.loaded / 1e6).toFixed(1)} / ${(progress.total / 1e6).toFixed(1)} MB` :
                  'Opening…'
              }
            </p>
          </>
      }
    </div>;
  }

  renderBookmarkPopover = () => {
    const { bookmark, top, right } = this.state.bookmarkPopover;
    return <div className="bookmark-popover" style={{ top, right }} role="dialog" aria-label="Bookmark">
      <button type="button" className="remove" onClick={() => this.removeBookmark(bookmark.id)}>Remove</button>
    </div>;
  }

  render = () =>
    <div className={css.reader} ref={(el) => this.rootEl = el}>
      {this.renderToolbar()}

      <div className="viewer-area" onPointerDownCapture={() => (this.state.bookmarkPopover || this.state.ifColorMenuOpen) && this.setState({ bookmarkPopover: null, ifColorMenuOpen: false })}>
        {
          this.state.status === 'success' ?
            <PdfViewer
              ref={(el) => this.viewer = el}
              pdfjs={this.state.pdfjs}
              pdfDocument={this.state.pdfDocument}
              pageSizes={this.state.pageSizes}
              highlights={this.state.highlights}
              bookmarks={this.state.bookmarks}
              color={this.state.color}
              zoom={1}
              focus={this.state.focus}
              onCreateHighlight={this.onCreateHighlight}
              onDeleteHighlight={this.onDeleteHighlight}
              onBookmarkClick={this.onBookmarkClick}
              onPageChange={this.onPageChange}
            /> :
            this.renderLoading()
        }
        {
          this.state.draft &&
          <div className="hint">
            Mark what this bookmark is about, then press Save
            <button type="button" className="cancel" onClick={this.cancelDraft}>Cancel</button>
          </div>
        }
        {
          this.state.savedPreview &&
          <div className="saved-preview" role="status">
            <div className="caption"><span className="mini-ribbon"/>Bookmarked · p. {this.state.savedPreview.page}</div>
            <PlaceSnippet
              pdfjs={this.state.pdfjs}
              pdfDocument={this.state.pdfDocument}
              place={this.state.savedPreview}
              pageHighlights={this.state.highlights.filter((h) => h.page === this.state.savedPreview.page)}
            />
          </div>
        }
      </div>

      {this.state.bookmarkPopover && this.renderBookmarkPopover()}
      {this.state.toast && <div className="toast" role="status">{this.state.toast}</div>}
      {this.props.footer}
    </div>
}

export default PdfReader;
