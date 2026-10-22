import { buildIndex, search } from '~/services/pdf/searchIndex';

import css from './index.scss';

class PdfSearch extends React.Component {
  static propTypes = {
    pdfjs: PropTypes.object.isRequired,
    pdfDocument: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  }

  state = {
    query: '',
    status: 'indexing',
    progress: null,
    results: [],
    activeIndex: -1
  }

  componentDidMount = () => {
    buildIndex(this.props.pdfjs, this.props.pdfDocument, (read, total) => !this.unmounted && this.setState({ progress: { read, total } }))
      .then((pages) => {
        if (this.unmounted) return;
        this.pages = pages;
        this.setState({ status: 'ready' }, this.runSearch);
      })
      .catch(() => !this.unmounted && this.setState({ status: 'failure' }));
  }

  componentWillUnmount = () => {
    this.unmounted = true;
    clearTimeout(this.searchTimeout);
  }

  onChange = (event) => {
    this.setState({ query: event.target.value });
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(this.runSearch, 150);
  }

  runSearch = () => {
    if (!this.pages) return;
    this.setState({ results: search(this.pages, this.state.query), activeIndex: -1 });
  }

  select = (index) => {
    const result = this.state.results[index];
    if (!result) return;
    this.setState({ activeIndex: index });
    this.props.onSelect(result);
    const el = this.listEl && this.listEl.children[index];
    if (el) el.scrollIntoView({ block: 'nearest' });
  }

  onKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const n = this.state.results.length;
      if (n === 0) return;
      const step = event.shiftKey ? -1 : 1;
      this.select((this.state.activeIndex + step + n) % n);
    } else if (event.key === 'Escape') {
      this.props.onClose();
    }
  }

  renderStatus = () => {
    if (this.state.status === 'failure') return "Couldn't read this book's text.";
    if (this.state.status === 'indexing') {
      const progress = this.state.progress;
      return progress ? `Reading the book… ${progress.read} / ${progress.total} pages` : 'Reading the book…';
    }
    if (this.state.query.trim().length < 2) return 'Type at least 2 letters. Enter goes to the next result.';
    const n = this.state.results.length;
    return n === 0 ? 'Nothing found.' : `${n >= 500 ? '500+' : n} ${n === 1 ? 'result' : 'results'}`;
  }

  render = () =>
    <div className={css.search} role="dialog" aria-label="Search in book">
      <header>
        <input
          id="pdf-search-input"
          type="search"
          placeholder="Search in this book"
          value={this.state.query}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          autoFocus
          autoComplete="off"
          spellCheck={false}
          aria-label="Search in this book"
        />
        <button type="button" className="close" onClick={this.props.onClose} aria-label="Close search">×</button>
      </header>
      <div className="status" role="status">{this.renderStatus()}</div>
      <ol className="results" ref={(el) => this.listEl = el}>
        {this.state.results.map((result, index) =>
          <li key={result.key}>
            <button type="button" className={index === this.state.activeIndex ? '-active' : ''} onClick={() => this.select(index)}>
              <span className="page">p. {result.page}</span>
              <span className="snippet">…{result.before}<mark>{result.match}</mark>{result.after}…</span>
            </button>
          </li>
        )}
      </ol>
    </div>
}

export default PdfSearch;
