import { textLinesOf, lineSpacingOf, SNAPSHOT_CONTEXT_LINES } from '~/services/pdf/textLinesOf';

import css from './index.scss';


// [claude comment] one snapshot at a time - each one decodes a whole scanned page (~80MB)
let snippetQueue = Promise.resolve();
const oneAtATime = (job) => {
  const run = snippetQueue.then(job, job);
  snippetQueue = run.catch(() => {});
  return run;
};

const extentOf = (highlight) => {
  const ys = highlight.points.map((p) => p[1]);
  return { top: Math.min(...ys) - highlight.width / 2, bottom: Math.max(...ys) + highlight.width / 2 };
};

// a bookmark is exactly the strokes drawn while making it
const groupIntoPlaces = (highlights, bookmarks) =>
  bookmarks.map((bookmark) => {
    const own = highlights.filter((h) => h.bookmarkId === bookmark.id && h.page === bookmark.page);
    const extents = own.map(extentOf);
    return {
      key: `bookmark-${bookmark.id}`,
      page: bookmark.page,
      top: extents.length ? Math.min(...extents.map((e) => e.top)) : bookmark.y + 0.012,
      bottom: extents.length ? Math.max(...extents.map((e) => e.bottom)) : bookmark.y + 0.03,
      highlights: own,
      bookmarks: [bookmark]
    };
  }).sort((a, b) => (a.page - b.page) || (a.top - b.top));

const SNIPPET_WIDTH = 900;

// [claude comment] finished snapshots as small image files, per document: { key: Promise<{ url, aspectRatio }> } - drawn once (one at a time, each decodes a whole scanned page), then reused every time the dropdown opens
const snapshotsByDocument = new WeakMap();

const snapshotKey = (place, pageHighlights) =>
  `${place.key}|${place.top.toFixed(4)}|${place.bottom.toFixed(4)}|${pageHighlights.map((h) => h.id + h.color).join(',')}`;

const drawSnapshotNow = async (pdfjs, pdfDocument, place, pageHighlights) => {
  const [page, textLines] = await Promise.all([
    pdfDocument.getPage(place.page),
    textLinesOf(pdfjs, pdfDocument, place.page)
  ]);
  const spacing = lineSpacingOf(textLines);
  const base = page.getViewport({ scale: 1 });

  const linesNearby = textLines.filter((l) => l.yCenter > place.top - 0.2 && l.yCenter < place.bottom + 0.2);
  const left = linesNearby.length ? Math.max(0, Math.min(...linesNearby.map((l) => l.x0)) - 0.02) : 0.05;
  const right = linesNearby.length ? Math.min(1, Math.max(...linesNearby.map((l) => l.x1)) + 0.02) : 0.95;
  const top = Math.max(0, place.top - spacing * SNAPSHOT_CONTEXT_LINES);
  const bottom = Math.min(1, place.bottom + spacing * SNAPSHOT_CONTEXT_LINES);

  const cropWidth = (right - left) * base.width;
  const cropHeight = (bottom - top) * base.height;
  const scale = SNIPPET_WIDTH * Math.min(window.devicePixelRatio || 1, 2) / cropWidth;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(cropWidth * scale);
  canvas.height = Math.round(cropHeight * scale);
  const ctx = canvas.getContext('2d');
  const offsetX = left * viewport.width;
  const offsetY = top * viewport.height;

  try {
    await page.render({ canvasContext: ctx, viewport, transform: [1, 0, 0, 1, -offsetX, -offsetY] }).promise;

    pageHighlights.forEach((h) => {
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.globalAlpha = 0.42;
      ctx.strokeStyle = h.color;
      ctx.lineWidth = h.width * viewport.height;
      ctx.lineCap = h.points.length === 2 ? 'butt' : 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      h.points.forEach(([x, y], i) => {
        const px = x * viewport.width - offsetX;
        const py = y * viewport.height - offsetY;
        if (i === 0) { ctx.moveTo(px, py); } else { ctx.lineTo(px, py); }
      });
      ctx.stroke();
      ctx.restore();
    });

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.95));
    if (!blob) throw new Error('Could not turn the snapshot into an image');
    return { url: URL.createObjectURL(blob), aspectRatio: cropHeight / cropWidth };
  } finally {
    page.cleanup();
    canvas.width = 0;
    canvas.height = 0;
  }
};

const drawSnapshot = (pdfjs, pdfDocument, place, pageHighlights) => {
  if (!snapshotsByDocument.has(pdfDocument)) snapshotsByDocument.set(pdfDocument, {});
  const snapshots = snapshotsByDocument.get(pdfDocument);
  const key = snapshotKey(place, pageHighlights);
  if (!snapshots[key]) {
    Object.keys(snapshots).filter((other) => other.startsWith(`${place.key}|`)).forEach((other) => {
      snapshots[other].then(({ url }) => URL.revokeObjectURL(url)).catch(() => {});
      delete snapshots[other];
    });
    snapshots[key] = oneAtATime(() => drawSnapshotNow(pdfjs, pdfDocument, place, pageHighlights));
    snapshots[key].catch((error) => {
      console.error(`Snapshot of p. ${place.page}:`, error);
      delete snapshots[key];
    });
  }
  return snapshots[key];
};

const preloadSnapshots = (pdfjs, pdfDocument, highlights, bookmarks) => {
  groupIntoPlaces(highlights, bookmarks).forEach((place) => {
    drawSnapshot(pdfjs, pdfDocument, place, highlights.filter((h) => h.page === place.page)).catch(() => {});
  });
};

const forgetSnapshots = (pdfDocument) => {
  const snapshots = snapshotsByDocument.get(pdfDocument);
  if (!snapshots) return;
  Object.values(snapshots).forEach((promise) => promise.then(({ url }) => URL.revokeObjectURL(url)).catch(() => {}));
  snapshotsByDocument.delete(pdfDocument);
};

class PlaceSnippet extends React.Component {
  static propTypes = {
    pdfjs: PropTypes.object.isRequired,
    pdfDocument: PropTypes.object.isRequired,
    place: PropTypes.object.isRequired,
    pageHighlights: PropTypes.array.isRequired
  }

  state = {
    snapshot: null
  }

  componentDidMount = () => {
    this.draw();
  }

  componentDidUpdate = (prevProps) => {
    if (snapshotKey(prevProps.place, prevProps.pageHighlights) !== snapshotKey(this.props.place, this.props.pageHighlights)) this.draw();
  }

  componentWillUnmount = () => {
    this.unmounted = true;
  }

  draw = () => {
    const key = snapshotKey(this.props.place, this.props.pageHighlights);
    this.drawingKey = key;
    drawSnapshot(this.props.pdfjs, this.props.pdfDocument, this.props.place, this.props.pageHighlights)
      .then((snapshot) => !this.unmounted && this.drawingKey === key && this.setState({ snapshot }))
      .catch(() => {});
  }

  render = () =>
    <div
      className={`snippet ${this.state.snapshot ? '-rendered' : ''}`}
      style={{ aspectRatio: `1 / ${this.state.snapshot ? this.state.snapshot.aspectRatio : 0.18}` }}
    >
      {this.state.snapshot && <img src={this.state.snapshot.url} alt=""/>}
    </div>
}

class PdfPlaces extends React.Component {
  static propTypes = {
    pdfjs: PropTypes.object.isRequired,
    pdfDocument: PropTypes.object.isRequired,
    highlights: PropTypes.array.isRequired,
    bookmarks: PropTypes.array.isRequired,
    currentPage: PropTypes.number,
    onSelect: PropTypes.func.isRequired,
    onRemoveBookmark: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    ifAlwaysBig: PropTypes.bool
  }

  state = {
    ifReviewing: !!this.props.ifAlwaysBig,
    // [claude comment] the bookmark whose "⋯" menu is open
    menuKey: null
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('pointerdown', this.onDocumentPointerDown);
    // [claude comment] start the list near where you are in the book
    requestAnimationFrame(() => {
      const current = this.listEl && this.listEl.querySelector('[data-current="true"]');
      if (current) current.scrollIntoView({ block: 'start' });
    });
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('pointerdown', this.onDocumentPointerDown);
  }

  onDocumentPointerDown = (event) => {
    if (this.state.menuKey && !event.target.closest('.place-menu, .place-menu-button')) this.setState({ menuKey: null });
  }

  onKeyDown = (event) => {
    if (event.key === 'Escape') {
      if (this.state.ifReviewing && !this.props.ifAlwaysBig) { this.setState({ ifReviewing: false }); } else { this.props.onClose(); }
    }
  }

  setListEl = (el) => {
    this.listEl = el;
  }

  render = () => {
    const places = groupIntoPlaces(this.props.highlights, this.props.bookmarks);
    const highlightsByPage = {};
    this.props.highlights.forEach((h) => { (highlightsByPage[h.page] = highlightsByPage[h.page] || []).push(h); });
    const currentIndex = places.findIndex((p) => p.page >= (this.props.currentPage || 1));

    const ifReviewing = this.state.ifReviewing;
    return <div className={`${css.places} ${ifReviewing ? '-reviewing' : ''}`} role="dialog" aria-label="Bookmarks">
      <header>
        <h3>{this.props.title ? this.props.title : 'Bookmarks'} <span className="count">{places.length}</span></h3>
        <div className="header-buttons">
          {
            places.length > 0 && !this.props.ifAlwaysBig &&
            <button type="button" className={`review ${ifReviewing ? '-active' : ''}`} onClick={() => this.setState({ ifReviewing: !ifReviewing })}>
              {ifReviewing ? 'Done' : 'Review'}
            </button>
          }
          <button type="button" className="close" onClick={this.props.onClose} aria-label="Close">×</button>
        </div>
      </header>

      <div className="list" ref={this.setListEl}>
        {
          places.length === 0 &&
          <p className="empty">
            No bookmarks yet. Press Bookmark, mark the place, then press Save.
          </p>
        }
        {
          places.map((place, index) =>
            <div
              key={place.key}
              className="place"
              data-current={index === currentIndex ? 'true' : 'false'}
            >
              <div className="meta">
                <button type="button" className="page-label" onClick={() => this.props.onSelect(place)}>
                  p. {place.page}{ifReviewing && <span className="go"> · open in book</span>}
                </button>
                <span className="place-menu-holder">
                  <button
                    type="button"
                    className="place-menu-button"
                    onClick={() => this.setState((state) => ({ menuKey: state.menuKey === place.key ? null : place.key }))}
                    aria-label={`Options for the bookmark on p. ${place.page}`}
                    aria-expanded={this.state.menuKey === place.key}
                  >⋯</button>
                  {
                    this.state.menuKey === place.key &&
                    <span className="place-menu" role="menu">
                      <button type="button" role="menuitem" className="danger-text" onClick={() => { this.setState({ menuKey: null }); this.props.onRemoveBookmark(place.bookmarks[0].id); }}>Remove bookmark</button>
                    </span>
                  }
                </span>
              </div>
              <button type="button" className="snippet-button" onClick={() => !ifReviewing && this.props.onSelect(place)} tabIndex={ifReviewing ? -1 : 0}>
                <PlaceSnippet
                  pdfjs={this.props.pdfjs}
                  pdfDocument={this.props.pdfDocument}
                  place={place}
                  pageHighlights={highlightsByPage[place.page] || []}
                />
              </button>
            </div>
          )
        }
      </div>
    </div>
  }
}

export { groupIntoPlaces, extentOf, PlaceSnippet, preloadSnapshots, forgetSnapshots };
export default PdfPlaces;
