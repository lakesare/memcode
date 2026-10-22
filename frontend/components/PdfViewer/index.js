import { pointsToHighlight, highlightToPathD } from '~/services/pdf/geometry';
import { textLinesOf } from '~/services/pdf/textLinesOf';
import { autoTrimOf } from '~/services/pdf/autoTrim';

import css from './index.scss';

const PAGE_PADDING_TOP = 14;
const MAX_PAGE_WIDTH = 1000;
const MAX_CANVAS_PIXELS = 5 * 1000 * 1000;
const MAX_RENDER_ATTEMPTS = 3;
const STUCK_RENDER_MS = 20000;
const MAX_BLANK_REDRAWS = 2;
const VIEW_WIDTH = 1000;
const DEFAULT_MARKER_WIDTH = 0.017;
const SVG_NS = 'http://www.w3.org/2000/svg';
const MIN_TRIMMED_WIDTH = 0.3;

class PdfPage extends React.PureComponent {
  static propTypes = {
    pageNumber: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    sheetWidth: PropTypes.number.isRequired,
    sheetLeft: PropTypes.number.isRequired,
    trimEdit: PropTypes.array,
    onTrimHandleDown: PropTypes.func.isRequired,
    highlights: PropTypes.array.isRequired,
    bookmarks: PropTypes.array.isRequired,
    focusedBookmarkId: PropTypes.string,
    registerPage: PropTypes.func.isRequired,
    onBookmarkClick: PropTypes.func.isRequired
  }

  render = () => {
    const viewHeight = VIEW_WIDTH * this.props.height / this.props.sheetWidth;
    const trimEdit = this.props.trimEdit;
    return <div
      className="page"
      data-page={this.props.pageNumber}
      ref={(el) => this.props.registerPage(this.props.pageNumber, el)}
      style={{ width: this.props.width, height: this.props.height }}
    >
      <div className="canvas-holder"/>
      <div className="page-placeholder">
        <span className="spinner"/>
        <span className="text">p. {this.props.pageNumber}</span>
        <button type="button" className="retry" data-retry-page={this.props.pageNumber} onPointerDown={(event) => event.stopPropagation()}>Couldn't show this page · Retry</button>
      </div>
      {/* [claude comment] the full page, shifted left by the trimmed margin - strokes and their coordinates are always relative to it */}
      <div className="sheet" style={{ left: this.props.sheetLeft, width: this.props.sheetWidth }}>
      <svg className="highlights" viewBox={`0 0 ${VIEW_WIDTH} ${viewHeight}`} preserveAspectRatio="none">
        {this.props.highlights.map((highlight) =>
          <path
            key={highlight.id}
            data-highlight-id={highlight.id}
            d={highlightToPathD(highlight.points, VIEW_WIDTH, viewHeight)}
            stroke={highlight.color}
            strokeWidth={highlight.width * viewHeight}
            strokeLinecap={highlight.points.length === 2 ? 'butt' : 'round'}
          />
        )}
      </svg>
      <svg className="live-layer" viewBox={`0 0 ${this.props.sheetWidth} ${this.props.height}`}/>
      </div>

      {
        trimEdit &&
        <>
          <div className="trim-shade -left" style={{ width: `${trimEdit[0] * 100}%` }}/>
          <div className="trim-shade -right" style={{ width: `${(1 - trimEdit[1]) * 100}%` }}/>
          <div className="trim-handle" style={{ left: `${trimEdit[0] * 100}%` }} onPointerDown={(event) => this.props.onTrimHandleDown(0, event)} role="slider" aria-label="Left trim" aria-valuenow={Math.round(trimEdit[0] * 100)}/>
          <div className="trim-handle" style={{ left: `${trimEdit[1] * 100}%` }} onPointerDown={(event) => this.props.onTrimHandleDown(1, event)} role="slider" aria-label="Right trim" aria-valuenow={Math.round(trimEdit[1] * 100)}/>
        </>
      }

      {this.props.bookmarks.map((bookmark) =>
        <React.Fragment key={bookmark.id}>
          {
            bookmark.id === this.props.focusedBookmarkId &&
            <div className="focus-line" style={{ top: `${bookmark.y * 100}%` }}/>
          }
          <button
            type="button"
            className={`ribbon ${bookmark.id === this.props.focusedBookmarkId ? '-focused' : ''}`}
            style={{ top: `${bookmark.y * 100}%` }}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => this.props.onBookmarkClick(bookmark, event.currentTarget)}
            aria-label={`Bookmark on page ${this.props.pageNumber}`}
          />
        </React.Fragment>
      )}

    </div>
  }
}

class PdfViewer extends React.Component {
  static propTypes = {
    pdfjs: PropTypes.object.isRequired,
    pdfDocument: PropTypes.object.isRequired,
    pageSizes: PropTypes.array.isRequired,
    highlights: PropTypes.array.isRequired,
    bookmarks: PropTypes.array.isRequired,
    color: PropTypes.string.isRequired,
    zoom: PropTypes.number.isRequired,
    focus: PropTypes.object,
    onCreateHighlight: PropTypes.func.isRequired,
    onDeleteHighlight: PropTypes.func.isRequired,
    onBookmarkClick: PropTypes.func.isRequired,
    onPageChange: PropTypes.func.isRequired,
    trimMode: PropTypes.oneOf(['off', 'auto', 'manual']).isRequired,
    manualTrim: PropTypes.array,
    onManualTrimSave: PropTypes.func.isRequired
  }

  state = {
    containerWidth: 0,
    page: this.props.focus ? this.props.focus.page : 1,
    // [claude comment] automatically found [left, right] edges of the book's text block, as fractions of the page width
    autoTrim: null,
    // [claude comment] [left, right] being set by hand (for every page), or null
    trimEdit: null
  }

  // [claude comment] drawn pages (current and its two neighbours) as images, { pageNumber: { img, url, width } } - a page is drawn by pdf.js into a canvas, checked, turned into an image file, and the canvas is freed, so no canvas stays on screen (Firefox can lose a displayed canvas's contents and show white)
  pages = {}
  rendering = null
  renderAttempts = {}
  blankRedraws = {}

  componentDidMount = () => {
    this.watchdog = setInterval(this.checkRendering, 1000);
    document.addEventListener('keydown', this.onKeyDown);
    this.resizeObserver = new ResizeObserver((entries) => {
      const containerWidth = Math.round(entries[0].contentRect.width);
      if (containerWidth !== this.state.containerWidth) {
        this.setState({ containerWidth });
      }
    });
    this.resizeObserver.observe(this.scrollerEl);
    this.props.onPageChange(this.state.page);
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.focus && (!prevProps.focus || prevProps.focus.key !== this.props.focus.key)) {
      this.goToPage(this.props.focus.page, this.props.focus.y);
      return;
    }
    if (prevState.page !== this.state.page) {
      this.props.onPageChange(this.state.page);
      if (this.state.trimEdit) this.setState({ trimEdit: null });
    }
    if (prevState.containerWidth === 0 && this.state.containerWidth > 0 && this.props.focus) {
      this.scrollToY(this.props.focus.y);
    } else if (this.pendingY !== undefined && this.state.containerWidth > 0) {
      this.scrollToY(this.pendingY);
    }
    this.pendingY = undefined;
    this.showAndSchedule();
  }

  componentWillUnmount = () => {
    this.unmounted = true;
    clearInterval(this.watchdog);
    document.removeEventListener('keydown', this.onKeyDown);
    this.resizeObserver.disconnect();
    if (this.rendering) this.rendering.cancel();
    Object.values(this.pages).forEach(forgetImage);
  }

  // ___navigation
  // [claude comment] targetPage moves synchronously, so quick repeated taps on an arrow each count (this.state.page only updates after a render)
  targetPage = this.state.page

  goToPage = (page, y = 0) => {
    const clamped = Math.max(1, Math.min(this.props.pageSizes.length, page));
    this.pendingY = y;
    this.targetPage = clamped;
    if (clamped === this.state.page) {
      this.scrollToY(y);
      this.pendingY = undefined;
    } else {
      this.setState({ page: clamped });
    }
  }

  previousPage = () => this.goToPage(this.targetPage - 1)
  nextPage     = () => this.goToPage(this.targetPage + 1)

  onKeyDown = (event) => {
    if (event.target.closest && event.target.closest('input, textarea, [contenteditable="true"]')) return;
    if (event.key === 'ArrowRight' || event.key === 'PageDown') {
      event.preventDefault();
      this.nextPage();
    } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      this.previousPage();
    }
  }

  // ___layout
  pageWidth = () => Math.max(200, Math.min(this.state.containerWidth - 24, MAX_PAGE_WIDTH) * this.props.zoom)

  // [left, right] of the page that's shown, or null while the automatic trim isn't known yet
  trimOf = (pageNumber) => {
    if (this.state.trimEdit && pageNumber === this.state.page) return [0, 1];
    if (this.props.trimMode === 'off') return [0, 1];
    if (this.props.trimMode === 'manual') return this.props.manualTrim || [0, 1];
    return this.state.autoTrim;
  }

  // the shown part fills the page width; the full page (the sheet) is wider by 1 / (right - left)
  layoutOf = (pageNumber) => {
    const [left, right] = this.trimOf(pageNumber) || [0, 1];
    const size = this.props.pageSizes[pageNumber - 1];
    const width = this.pageWidth();
    const sheetWidth = width / (right - left);
    return { left, right, width, sheetWidth, height: sheetWidth * size.height / size.width };
  }

  pageHeight = () => this.layoutOf(this.state.page).height

  requestAutoTrim = () => {
    if (this.ifAutoTrimRequested) return;
    this.ifAutoTrimRequested = true;
    autoTrimOf(this.props.pdfjs, this.props.pdfDocument).then((autoTrim) => !this.unmounted && this.setState({ autoTrim }));
  }

  // ___manual trim
  startTrimming = () => {
    this.setState({ trimEdit: [...(this.props.manualTrim || this.state.autoTrim || [0.08, 0.92])] });
  }

  saveTrim = () => {
    this.props.onManualTrimSave(this.state.trimEdit.map((x) => Math.round(x * 1000) / 1000));
    this.setState({ trimEdit: null });
  }

  onTrimHandleDown = (side, event) => {
    event.stopPropagation();
    event.preventDefault();
    this.pagesEl.setPointerCapture(event.pointerId);
    this.trimDrag = { side, pointerId: event.pointerId };
  }

  moveTrimHandle = (event) => {
    const rect = this.pageEl.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const [left, right] = this.state.trimEdit;
    const trimEdit = this.trimDrag.side === 0 ?
      [Math.min(x, right - MIN_TRIMMED_WIDTH), right] :
      [left, Math.max(x, left + MIN_TRIMMED_WIDTH)];
    this.setState({ trimEdit: trimEdit.map((v) => Math.max(0, Math.min(1, v))) });
  }

  // [claude comment] y=0 shows the top of the page; any other y is put 30% down the screen, the line getPosition() reads back
  scrollToY = (y) => {
    if (!this.scrollerEl) return;
    this.scrollerEl.scrollTop = y > 0 ? PAGE_PADDING_TOP + y * this.pageHeight() - this.scrollerEl.clientHeight * 0.3 : 0;
  }

  getPosition = () => {
    const position = this.scrollerEl.scrollTop + this.scrollerEl.clientHeight * 0.3 - PAGE_PADDING_TOP;
    return { page: this.state.page, y: Math.max(0, Math.min(1, position / this.pageHeight())) };
  }

  // ___canvases
  imageKeyOf = (pageNumber) => {
    const trim = this.trimOf(pageNumber);
    return trim ? `${Math.round(this.pageWidth() * pixelRatio())}|${trim[0].toFixed(4)}|${trim[1].toFixed(4)}` : null;
  }

  showAndSchedule = () => {
    if (this.state.containerWidth === 0 || this.unmounted) return;
    const page = this.state.page;
    const wanted = [page, page + 1, page - 1].filter((n) => n >= 1 && n <= this.props.pageSizes.length);
    if (this.props.trimMode === 'auto') this.requestAutoTrim();

    Object.keys(this.pages).map(Number).filter((n) => !wanted.includes(n)).forEach((n) => {
      forgetImage(this.pages[n]);
      delete this.pages[n];
      this.releasePage(n);
    });
    if (this.rendering && !wanted.includes(this.rendering.pageNumber)) {
      this.rendering.cancel();
      this.rendering = null;
    }

    const entry = this.pages[page] && this.pages[page].key === this.imageKeyOf(page) ? this.pages[page] : null;
    if (entry && this.pageEl && this.pageEl.dataset.page === String(page)) {
      const holder = this.pageEl.querySelector('.canvas-holder');
      if (holder.firstChild !== entry.img) holder.replaceChildren(entry.img);
      this.pageEl.classList.add('-rendered');
    }
    if (this.pageEl && !entry) {
      this.pageEl.classList.remove('-rendered');
      if (this.pageEl.querySelector('.canvas-holder').firstChild) this.pageEl.querySelector('.canvas-holder').replaceChildren();
    }
    if (this.pageEl) this.pageEl.classList.toggle('-failed', (this.renderAttempts[page] || 0) >= MAX_RENDER_ATTEMPTS && !entry);

    if (this.rendering) return;
    const next = wanted.find((n) => this.imageKeyOf(n) && (!this.pages[n] || this.pages[n].key !== this.imageKeyOf(n)) && (this.renderAttempts[n] || 0) < MAX_RENDER_ATTEMPTS);
    if (next) this.renderPage(next, this.layoutOf(next), this.imageKeyOf(next));
  }

  // [claude comment] only the shown (trimmed) part of the page is drawn, at the screen's resolution
  renderPage = async (pageNumber, layout, key) => {
    const job = { pageNumber, startedAt: Date.now(), cancelled: false, cancel: () => { job.cancelled = true; } };
    this.rendering = job;
    let canvas = null;
    try {
      const page = await this.props.pdfDocument.getPage(pageNumber);
      if (job.cancelled) return;
      const base = page.getViewport({ scale: 1 });
      let ratio = pixelRatio();
      if (layout.width * layout.height * ratio * ratio > MAX_CANVAS_PIXELS) {
        ratio = Math.sqrt(MAX_CANVAS_PIXELS / (layout.width * layout.height));
      }
      const viewport = page.getViewport({ scale: layout.sheetWidth * ratio / base.width });
      canvas = document.createElement('canvas');
      canvas.width = Math.round(layout.width * ratio);
      canvas.height = Math.round(layout.height * ratio);
      const context = canvas.getContext('2d');
      if (!context) throw new Error('No canvas memory left');

      const task = page.render({ canvasContext: context, viewport, transform: [1, 0, 0, 1, -layout.left * viewport.width, 0] });
      job.cancel = () => { job.cancelled = true; task.cancel(); };
      await task.promise;
      if (job.cancelled || this.isBlankAndShouldRedraw(pageNumber, canvas)) return;

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.95));
      if (!blob) throw new Error('Could not turn the drawn page into an image');
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.alt = '';
      img.src = url;
      await img.decode();
      if (job.cancelled) {
        URL.revokeObjectURL(url);
        return;
      }
      if (this.pages[pageNumber]) forgetImage(this.pages[pageNumber]);
      this.pages[pageNumber] = { img, url, key };
      delete this.renderAttempts[pageNumber];
    } catch (error) {
      if (!job.cancelled && !(error && error.name === 'RenderingCancelledException')) {
        console.error(`Page ${pageNumber}:`, error);
        this.renderAttempts[pageNumber] = (this.renderAttempts[pageNumber] || 0) + 1;
      }
    } finally {
      if (canvas) freeCanvas(canvas);
      if (this.rendering === job) this.rendering = null;
      if (!this.unmounted) setTimeout(this.showAndSchedule, 0);
    }
  }

  // [claude comment] a fully white drawing of a page is redrawn - only twice, since a page can really be blank
  isBlankAndShouldRedraw = (pageNumber, canvas) => {
    if ((this.blankRedraws[pageNumber] || 0) >= MAX_BLANK_REDRAWS || !isBlank(canvas)) return false;
    this.blankRedraws[pageNumber] = (this.blankRedraws[pageNumber] || 0) + 1;
    console.warn(`Page ${pageNumber}: came out completely white, drawing it again (${this.blankRedraws[pageNumber]}/${MAX_BLANK_REDRAWS})`);
    return true;
  }

  checkRendering = () => {
    if (this.rendering && Date.now() - this.rendering.startedAt > STUCK_RENDER_MS) {
      console.warn(`Page ${this.rendering.pageNumber}: render took over ${STUCK_RENDER_MS / 1000}s, restarting it`);
      this.rendering.cancel();
      this.rendering = null;
    }
    this.showAndSchedule();
  }

  // [claude comment] a decoded 600dpi scan is ~80MB, so a page that's no longer current or a neighbour gives it back - never right after drawing, the browser may still be painting from it
  releasePage = (pageNumber) => {
    this.props.pdfDocument.getPage(pageNumber).then((page) => {
      const ifNeeded = Math.abs(pageNumber - this.state.page) <= 1 || (this.rendering && this.rendering.pageNumber === pageNumber);
      if (!this.unmounted && !ifNeeded) page.cleanup();
    }).catch(() => {});
  }

  retryPage = () => {
    delete this.renderAttempts[this.state.page];
    this.showAndSchedule();
  }

  registerPage = (pageNumber, el) => {
    if (el) this.pageEl = el;
  }

  textLinesOf = (pageNumber) =>
    textLinesOf(this.props.pdfjs, this.props.pdfDocument, pageNumber)

  // ___pointer handling
  // [claude comment] the stylus (or a mouse) always marks, fingers always scroll and pinch natively - the stylus's own touches are cancelled so it never scrolls
  onTouchStart = (event) => {
    const ifStylus = Array.from(event.changedTouches).some((touch) => touch.touchType === 'stylus');
    if (ifStylus || this.penDownId !== undefined) event.preventDefault();
  }

  onPointerDown = (event) => {
    if (event.pointerType === 'pen') this.penDownId = event.pointerId;
    if (event.pointerType === 'touch') return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    if (this.state.trimEdit) return;
    const pageEl = event.target.closest('[data-page]');
    if (!pageEl) return;
    const pageNumber = parseInt(pageEl.dataset.page, 10);
    const rect = pageEl.querySelector('.sheet').getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    event.preventDefault();
    this.pagesEl.setPointerCapture(event.pointerId);

    this.textLinesOf(pageNumber);
    const liveLayer = pageEl.querySelector('.live-layer');
    const pathEl = document.createElementNS(SVG_NS, 'path');
    pathEl.setAttribute('stroke', this.props.color);
    pathEl.setAttribute('stroke-width', String(DEFAULT_MARKER_WIDTH * rect.height));
    liveLayer.appendChild(pathEl);
    this.stroke = { pointerId: event.pointerId, pageNumber, rect, points: [[x, y]], pathEl, startClient: [event.clientX, event.clientY] };
  }

  onPointerMove = (event) => {
    if (this.trimDrag && event.pointerId === this.trimDrag.pointerId) {
      this.moveTrimHandle(event);
      return;
    }
    if (this.stroke && event.pointerId === this.stroke.pointerId) {
      const events = event.getCoalescedEvents ? event.getCoalescedEvents() : [event];
      const { rect } = this.stroke;
      (events.length ? events : [event]).forEach((e) => this.stroke.points.push([e.clientX - rect.left, e.clientY - rect.top]));
      this.stroke.pathEl.setAttribute('d', this.stroke.points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' '));
    }
  }

  onPointerUp = (event) => {
    if (event.pointerId === this.penDownId) this.penDownId = undefined;
    if (this.trimDrag && event.pointerId === this.trimDrag.pointerId) this.trimDrag = null;

    if (this.stroke && event.pointerId === this.stroke.pointerId) {
      this.finishStroke(event.type === 'pointercancel');
    }
  }

  finishStroke = async (ifCancelled) => {
    const stroke = this.stroke;
    this.stroke = null;
    if (ifCancelled) {
      stroke.pathEl.remove();
      return;
    }
    // [claude comment] a tap (no real movement) with the marker removes the highlight under it, there's no separate eraser
    const [x0, y0] = stroke.points[0];
    const ifTap = stroke.points.every(([x, y]) => Math.hypot(x - x0, y - y0) < 6);
    if (ifTap) {
      stroke.pathEl.remove();
      this.eraseAt(...stroke.startClient);
      return;
    }
    const textLines = await this.textLinesOf(stroke.pageNumber);
    const shape = pointsToHighlight(stroke.points, stroke.rect.width, stroke.rect.height, textLines, DEFAULT_MARKER_WIDTH);
    if (shape) {
      this.props.onCreateHighlight({ page: stroke.pageNumber, color: this.props.color, ...shape });
    }
    // [claude comment] removed on the next frame so the stored highlight is already painted - no flicker
    requestAnimationFrame(() => stroke.pathEl.remove());
  }

  eraseAt = (clientX, clientY) => {
    const offsets = [[0, 0], [6, 0], [-6, 0], [0, 6], [0, -6]];
    for (const [dx, dy] of offsets) {
      const hit = document.elementsFromPoint(clientX + dx, clientY + dy).find((el) => el.getAttribute && el.getAttribute('data-highlight-id'));
      if (hit) {
        this.props.onDeleteHighlight(hit.getAttribute('data-highlight-id'));
        return;
      }
    }
  }

  setPagesEl = (el) => {
    if (this.pagesEl) this.pagesEl.removeEventListener('touchstart', this.onTouchStart);
    this.pagesEl = el;
    if (el) el.addEventListener('touchstart', this.onTouchStart, { passive: false });
  }

  render = () => {
    const page = this.state.page;
    const highlights = this.props.highlights.filter((h) => h.page === page);
    const bookmarks = this.props.bookmarks.filter((b) => b.page === page);
    const focusedBookmarkId = this.props.focus ? this.props.focus.bookmarkId : null;
    const layout = this.layoutOf(page);
    const width = layout.width;

    return <div className={css.viewer}>
      <div className="scroller" ref={(el) => this.scrollerEl = el}>
        <div
          className="pages"
          ref={this.setPagesEl}
          style={{ width: width + 24 }}
          onPointerDown={this.onPointerDown}
          onPointerMove={this.onPointerMove}
          onPointerUp={this.onPointerUp}
          onPointerCancel={this.onPointerUp}
          onClick={(event) => event.target.closest('[data-retry-page]') && this.retryPage()}
          onContextMenu={(event) => event.preventDefault()}
        >
          {
            this.state.containerWidth > 0 &&
            <PdfPage
              key={page}
              pageNumber={page}
              width={width}
              height={layout.height}
              sheetWidth={layout.sheetWidth}
              sheetLeft={-layout.left * layout.sheetWidth}
              trimEdit={this.state.trimEdit}
              onTrimHandleDown={this.onTrimHandleDown}
              highlights={highlights}
              bookmarks={bookmarks}
              focusedBookmarkId={focusedBookmarkId}
              registerPage={this.registerPage}
              onBookmarkClick={this.props.onBookmarkClick}
            />
          }
        </div>
      </div>
      {
        this.state.trimEdit &&
        <div className="trim-bar" role="toolbar" aria-label="Trim margins">
          <span className="what">Drag the edges · applies to every page</span>
          <button type="button" onClick={() => this.setState({ trimEdit: null })}>Cancel</button>
          <button type="button" className="-primary" onClick={this.saveTrim}>Save</button>
        </div>
      }
    </div>
  }
}

// [claude comment] browsers keep a removed canvas's pixels until garbage collection - shrinking frees them immediately
const isBlank = (canvas) => {
  if (!canvas.width || !canvas.height) return true;
  const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] < 200 || data[i + 1] < 200 || data[i + 2] < 200) return false;
  }
  return true;
};

const pixelRatio = () => Math.min(window.devicePixelRatio || 1, 2);

const forgetImage = (entry) => {
  URL.revokeObjectURL(entry.url);
  entry.img.removeAttribute('src');
};

const freeCanvas = (canvas) => {
  canvas.width = 0;
  canvas.height = 0;
};

export default PdfViewer;
