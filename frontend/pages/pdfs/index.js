import { Link } from 'react-router';
import Main from '~/appComponents/Main';
import api from '~/api';
import { uploadPdf, forgetPdfBytes } from '~/services/pdf/loadPdf';

import css from './index.scss';

class Page_pdfs extends React.Component {
  state = {
    status: 'loading',
    pdfs: [],
    upload: null,
    uploadError: null,
    confirmDeleteId: null
  }

  componentDidMount = () => {
    this.load();
  }

  load = () =>
    api.get.PdfApi.getMyPdfs(false, {})
      .then((pdfs) => this.setState({ status: 'success', pdfs }))
      .catch(() => this.setState({ status: 'failure' }))

  onFileChosen = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    for (const file of files) {
      this.setState({ upload: { name: file.name, loaded: 0, total: file.size }, uploadError: null });
      try {
        await uploadPdf(file, (loaded, total) => this.setState({ upload: { name: file.name, loaded, total } }));
      } catch (error) {
        this.setState({ uploadError: `${file.name}: ${error.message}` });
      }
    }
    this.setState({ upload: null });
    this.load();
  }

  deletePdf = (pdfId) => {
    this.setState((state) => ({ pdfs: state.pdfs.filter((p) => p.id !== pdfId), confirmDeleteId: null }));
    forgetPdfBytes(pdfId);
    api.post.PdfApi.deletePdf(false, { pdfId }).catch(this.load);
  }

  renderPdf = (pdf) => {
    const progress = pdf.nOfPages ? Math.min(1, pdf.currentPage / pdf.nOfPages) : 0;
    return <li key={pdf.id} className="pdf">
      <Link to={`/pdfs/${pdf.id}`} className="open">
        <div className="cover" aria-hidden="true">
          <span className="initial">{pdf.title.trim().charAt(0).toUpperCase()}</span>
          {pdf.nOfBookmarks > 0 && <span className="cover-ribbon"/>}
        </div>
        <div className="info">
          <h3>{pdf.title}</h3>
          <div className="stats">
            <span>{pdf.nOfPages ? `p. ${pdf.currentPage} of ${pdf.nOfPages}` : 'Not opened yet'}</span>
            {pdf.nOfBookmarks > 0 && <span className="bookmarks">{pdf.nOfBookmarks} {pdf.nOfBookmarks === 1 ? 'bookmark' : 'bookmarks'}</span>}
          </div>
          {pdf.nOfPages > 0 && <div className="progress"><div style={{ width: `${progress * 100}%` }}/></div>}
        </div>
      </Link>
      <div className="actions">
        {
          pdf.nOfDueBookmarks > 0 &&
          <Link to={`/pdfs/review?pdfId=${pdf.id}`} className="review">Review {pdf.nOfDueBookmarks}</Link>
        }
        {
          this.state.confirmDeleteId === pdf.id ?
            <span className="confirm">
              <button type="button" className="danger" onClick={() => this.deletePdf(pdf.id)}>Delete book</button>
              <button type="button" className="cancel" onClick={() => this.setState({ confirmDeleteId: null })}>Cancel</button>
            </span> :
            <button type="button" className="delete" onClick={() => this.setState({ confirmDeleteId: pdf.id })} aria-label={`Delete ${pdf.title}`} title="Delete">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v5.5M14 11v5.5"/></svg>
            </button>
        }
      </div>
    </li>;
  }

  render = () => {
    const nOfDue = this.state.pdfs.reduce((sum, p) => sum + p.nOfDueBookmarks, 0);
    const upload = this.state.upload;
    return <Main className={css.main}>
      <div className="container pdfs-page">
        <div className="top">
          <h1>Books {this.state.pdfs.length > 0 && <span className="count">{this.state.pdfs.length}</span>}</h1>
          <div className="top-actions">
            {
              nOfDue > 0 &&
              <Link to="/pdfs/review" className="review-all">Review {nOfDue} {nOfDue === 1 ? 'place' : 'places'}</Link>
            }
            <label className={`upload ${upload ? '-busy' : ''}`}>
              <input id="pdf-upload" type="file" accept="application/pdf,.pdf" multiple onChange={this.onFileChosen} disabled={!!upload}/>
              {upload ? `Uploading… ${Math.round(100 * upload.loaded / (upload.total || 1))}%` : '+ Add PDF'}
            </label>
          </div>
        </div>

        {this.state.uploadError && <p className="error">{this.state.uploadError}</p>}

        {
          this.state.status === 'loading' ? <p className="empty">Loading…</p> :
          this.state.status === 'failure' ? <p className="error">Couldn't load your books - check your connection.</p> :
          this.state.pdfs.length === 0 ? <p className="empty">No books yet. Add a PDF to start reading.</p> :
          <ul className="pdfs">{this.state.pdfs.map(this.renderPdf)}</ul>
        }
      </div>
    </Main>;
  }
}

export default Page_pdfs;
