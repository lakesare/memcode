import { Link } from 'react-router';
import Main from '~/appComponents/Main';
import api from '~/api';
import withRouter from '~/services/withRouter';
import { uploadPdf, forgetPdfBytes } from '~/services/pdf/loadPdf';
import BookmarksModal from './BookmarksModal';

import css from './index.scss';

class Page_pdfs extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  state = {
    status: 'loading',
    pdfs: [],
    folders: [],
    // [claude comment] 'unsorted' (books in no folder) or a folder id - starts on the default folder
    selectedFolder: null,
    upload: null,
    uploadError: null,
    confirmDeleteId: null,
    renamingId: null,
    renameValue: '',
    bookmarksPdf: null,
    // [claude comment] the book whose "⋯" menu is open, and which part of the menu shows ('main' or 'move')
    menu: null,
    newFolderName: null,
    folderRename: null,
    // [claude comment] the folders "⋯" menu, acting on the selected folder: null | 'main' | 'confirmDelete'
    folderMenu: null
  }

  componentDidMount = () => {
    document.addEventListener('pointerdown', this.onDocumentPointerDown);
    this.load();
  }

  componentWillUnmount = () => {
    document.removeEventListener('pointerdown', this.onDocumentPointerDown);
  }

  onDocumentPointerDown = (event) => {
    if (this.state.menu && !event.target.closest('.book-menu, .menu-button')) this.setState({ menu: null });
    if (this.state.folderMenu && !event.target.closest('.folder-menu, .folder-menu-button')) this.setState({ folderMenu: null });
  }

  load = () =>
    Promise.all([api.get.PdfApi.getMyPdfs(false, {}), api.get.PdfApi.getMyFolders(false, {})])
      .then(([pdfs, folders]) => this.setState((state) => {
        const defaultFolder = folders.find((f) => f.isDefault);
        const ifSelectedExists = state.selectedFolder === 'unsorted' || folders.some((f) => f.id === state.selectedFolder);
        return {
          status: 'success',
          pdfs,
          folders,
          selectedFolder: ifSelectedExists ? state.selectedFolder : (defaultFolder ? defaultFolder.id : 'unsorted')
        };
      }))
      .catch(() => this.setState({ status: 'failure' }))

  currentFolderId = () => (this.state.selectedFolder === 'unsorted' ? null : this.state.selectedFolder)

  onFileChosen = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    const folderId = this.currentFolderId();
    for (const file of files) {
      this.setState({ upload: { name: file.name, loaded: 0, total: file.size }, uploadError: null });
      try {
        const pdf = await uploadPdf(file, (loaded, total) => this.setState({ upload: { name: file.name, loaded, total } }));
        if (folderId) await api.post.PdfApi.movePdf(false, { pdfId: pdf.id, folderId });
      } catch (error) {
        this.setState({ uploadError: `${file.name}: ${error.message}` });
      }
    }
    this.setState({ upload: null });
    this.load();
  }

  // ___books
  deletePdf = (pdfId) => {
    const pdf = this.state.pdfs.find((p) => p.id === pdfId);
    this.setState((state) => ({ pdfs: state.pdfs.filter((p) => p.id !== pdfId), confirmDeleteId: null }));
    if (pdf) forgetPdfBytes(pdf);
    api.post.PdfApi.deletePdf(false, { pdfId }).catch(this.load);
  }

  startRename = (pdf) => {
    this.setState({ renamingId: pdf.id, renameValue: pdf.title, confirmDeleteId: null, menu: null });
  }

  saveRename = () => {
    const pdfId = this.state.renamingId;
    const title = this.state.renameValue.trim();
    const pdf = this.state.pdfs.find((p) => p.id === pdfId);
    this.setState({ renamingId: null });
    if (!pdf || !title || title === pdf.title) return;
    this.setState((state) => ({ pdfs: state.pdfs.map((p) => (p.id === pdfId ? { ...p, title } : p)) }));
    api.post.PdfApi.updatePdf(false, { pdfId, title }).catch(this.load);
  }

  movePdf = (pdfId, folderId) => {
    this.setState((state) => ({ menu: null, pdfs: state.pdfs.map((p) => (p.id === pdfId ? { ...p, folderId } : p)) }));
    api.post.PdfApi.movePdf(false, { pdfId, folderId }).catch(this.load);
  }

  // ___folders
  createFolder = () => {
    const name = (this.state.newFolderName || '').trim();
    this.setState({ newFolderName: null });
    if (!name) return;
    api.post.PdfApi.createFolder(false, { name })
      .then((folder) => this.setState((state) => ({ folders: [...state.folders, folder], selectedFolder: folder.id })))
      .catch(this.load);
  }

  saveFolderRename = () => {
    if (!this.state.folderRename) return;
    const { folderId, name } = this.state.folderRename;
    this.setState({ folderRename: null });
    const trimmed = name.trim();
    if (!trimmed) return;
    this.setState((state) => ({ folders: state.folders.map((f) => (f.id === folderId ? { ...f, name: trimmed } : f)) }));
    api.post.PdfApi.renameFolder(false, { folderId, name: trimmed }).catch(this.load);
  }

  makeDefault = (folderId) => {
    this.setState((state) => ({ folderMenu: null, folders: state.folders.map((f) => ({ ...f, isDefault: f.id === folderId })) }));
    api.post.PdfApi.setDefaultFolder(false, { folderId }).catch(this.load);
  }

  moveFolder = (folderId, direction) => {
    this.setState((state) => {
      const folders = [...state.folders];
      const index = folders.findIndex((f) => f.id === folderId);
      const otherIndex = index + direction;
      if (otherIndex >= 0 && otherIndex < folders.length) {
        [folders[index], folders[otherIndex]] = [folders[otherIndex], folders[index]];
      }
      return { folders };
    });
    api.post.PdfApi.moveFolder(false, { folderId, direction }).catch(this.load);
  }

  deleteFolder = (folderId) => {
    this.setState((state) => ({
      folders: state.folders.filter((f) => f.id !== folderId),
      pdfs: state.pdfs.map((p) => (p.folderId === folderId ? { ...p, folderId: null } : p)),
      selectedFolder: 'unsorted',
      folderMenu: null
    }));
    api.post.PdfApi.deleteFolder(false, { folderId }).catch(this.load);
  }

  onEnterEscape = (onEnter, onEscape) => (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onEnter();
    } else if (event.key === 'Escape') {
      onEscape();
    }
  }

  renderFolderMenu = () => {
    const folder = this.state.folders.find((f) => f.id === this.state.selectedFolder);
    return <div className="folder-menu" role="menu">
      {
        folder && this.state.folderMenu === 'confirmDelete' ?
          <>
            <span className="question">Delete "{folder.name}"? Its books go to All.</span>
            <button type="button" role="menuitem" className="danger-text" onClick={() => this.deleteFolder(folder.id)}>Delete folder</button>
            <button type="button" role="menuitem" onClick={() => this.setState({ folderMenu: null })}>Cancel</button>
          </> :
          <>
            <button type="button" role="menuitem" onClick={() => this.setState({ folderMenu: null, newFolderName: '' })}>New folder</button>
            {
              folder &&
              <>
                <span className="separator"/>
                <button type="button" role="menuitem" onClick={() => this.setState({ folderMenu: null, folderRename: { folderId: folder.id, name: folder.name } })}>Rename "{folder.name}"</button>
                {
                  this.state.folders[0].id !== folder.id &&
                  <button type="button" role="menuitem" onClick={() => this.moveFolder(folder.id, -1)}>Move left</button>
                }
                {
                  this.state.folders[this.state.folders.length - 1].id !== folder.id &&
                  <button type="button" role="menuitem" onClick={() => this.moveFolder(folder.id, 1)}>Move right</button>
                }
                {
                  folder.isDefault ?
                    <button type="button" role="menuitem" onClick={() => this.makeDefault(null)}>Stop opening "{folder.name}" by default</button> :
                    <button type="button" role="menuitem" onClick={() => this.makeDefault(folder.id)}>Make "{folder.name}" default</button>
                }
                <button type="button" role="menuitem" className="danger-text" onClick={() => this.setState({ folderMenu: 'confirmDelete' })}>Delete "{folder.name}"</button>
              </>
            }
          </>
      }
    </div>;
  }

  renderFolders = () => {
    const selected = this.state.selectedFolder;
    return <div className="folders">
      <div className="folder-tabs" role="tablist">
        {this.state.folders.map((f) => (
          this.state.folderRename && this.state.folderRename.folderId === f.id ?
            <input
              key={f.id}
              id={`folder-rename-${f.id}`}
              className="folder-input"
              value={this.state.folderRename.name}
              onChange={(event) => this.setState({ folderRename: { folderId: f.id, name: event.target.value } })}
              onKeyDown={this.onEnterEscape(this.saveFolderRename, () => this.setState({ folderRename: null }))}
              onBlur={this.saveFolderRename}
              aria-label="Folder name"
              autoFocus
            /> :
            <button
              type="button"
              role="tab"
              key={f.id}
              aria-selected={selected === f.id}
              className={`folder-tab ${selected === f.id ? '-active' : ''}`}
              onClick={() => this.setState({ selectedFolder: f.id, folderMenu: null })}
            >
              {f.name}
            </button>
        ))}
        {
          this.state.newFolderName !== null &&
          <input
            id="new-folder-name"
            className="folder-input"
            placeholder="Folder name"
            value={this.state.newFolderName}
            onChange={(event) => this.setState({ newFolderName: event.target.value })}
            onKeyDown={this.onEnterEscape(this.createFolder, () => this.setState({ newFolderName: null }))}
            onBlur={this.createFolder}
            aria-label="New folder name"
            autoFocus
          />
        }
        <button
          type="button"
          role="tab"
          aria-selected={selected === 'unsorted'}
          className={`folder-tab -all ${selected === 'unsorted' ? '-active' : ''}`}
          onClick={() => this.setState({ selectedFolder: 'unsorted', folderMenu: null })}
        >
          All
        </button>
        <span className="folder-menu-holder">
          <button
            type="button"
            className="folder-menu-button"
            onClick={() => this.setState((state) => ({ folderMenu: state.folderMenu ? null : 'main' }))}
            aria-label="Folder options"
            aria-expanded={!!this.state.folderMenu}
          >⋯</button>
          {this.state.folderMenu && this.renderFolderMenu()}
        </span>
      </div>
    </div>;
  }

  renderMenu = (pdf) =>
    <div className="book-menu" role="menu">
      {
        this.state.menu.view === 'move' ?
          <>
            <button type="button" role="menuitem" className="back" onClick={() => this.setState({ menu: { pdfId: pdf.id, view: 'main' } })}>‹ Move to folder</button>
            {this.state.folders.map((f) =>
              <button type="button" role="menuitemradio" key={f.id} aria-checked={pdf.folderId === f.id} className={pdf.folderId === f.id ? '-current' : ''} onClick={() => this.movePdf(pdf.id, f.id)}>
                {f.name}
              </button>
            )}
            <button type="button" role="menuitemradio" aria-checked={!pdf.folderId} className={!pdf.folderId ? '-current' : ''} onClick={() => this.movePdf(pdf.id, null)}>
              No folder
            </button>
          </> :
          <>
            <button type="button" role="menuitem" onClick={() => this.startRename(pdf)}>Rename</button>
            <button type="button" role="menuitem" onClick={() => this.setState({ menu: { pdfId: pdf.id, view: 'move' } })}>Move to folder</button>
            <button type="button" role="menuitem" className="danger-text" onClick={() => this.setState({ confirmDeleteId: pdf.id, menu: null })}>Delete</button>
          </>
      }
    </div>

  renderPdf = (pdf) => {
    const progress = pdf.nOfPages ? Math.min(1, pdf.currentPage / pdf.nOfPages) : 0;
    const ifRenaming = this.state.renamingId === pdf.id;
    const ifMenuOpen = !!(this.state.menu && this.state.menu.pdfId === pdf.id);
    // [claude comment] while renaming, the row isn't a link, so tapping into the title field doesn't open the book
    const Open = ifRenaming ? 'div' : Link;
    return <li key={pdf.id} className={`pdf ${ifMenuOpen ? '-menu-open' : ''}`}>
      <Open {...(ifRenaming ? {} : { to: `/pdfs/${pdf.id}` })} className="open">
        <div className="cover" aria-hidden="true">
          <span className="initial">{pdf.title.trim().charAt(0).toUpperCase()}</span>
          {pdf.nOfBookmarks > 0 && <span className="cover-ribbon"/>}
        </div>
        <div className="info">
          {
            ifRenaming ?
              <input
                id={`rename-${pdf.id}`}
                className="rename-input"
                value={this.state.renameValue}
                onChange={(event) => this.setState({ renameValue: event.target.value })}
                onKeyDown={this.onEnterEscape(this.saveRename, () => this.setState({ renamingId: null }))}
                onBlur={this.saveRename}
                aria-label="Book title"
                autoFocus
              /> :
              <h3>{pdf.title}</h3>
          }
          <div className="stats">
            <span>{pdf.nOfPages ? `p. ${pdf.currentPage} of ${pdf.nOfPages}` : 'Not opened yet'}</span>
            {
              pdf.nOfBookmarks > 0 &&
              <button
                type="button"
                className="bookmarks"
                onClick={(event) => { event.preventDefault(); event.stopPropagation(); this.setState({ bookmarksPdf: pdf }); }}
              >
                {pdf.nOfBookmarks} {pdf.nOfBookmarks === 1 ? 'bookmark' : 'bookmarks'}
              </button>
            }
          </div>
          {pdf.nOfPages > 0 && <div className="progress"><div style={{ width: `${progress * 100}%` }}/></div>}
        </div>
      </Open>
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
            <span className="menu-holder">
              <button
                type="button"
                className="menu-button"
                onClick={() => this.setState({ menu: ifMenuOpen ? null : { pdfId: pdf.id, view: 'main' } })}
                aria-label={`Options for ${pdf.title}`}
                aria-expanded={ifMenuOpen}
              >⋯</button>
              {ifMenuOpen && this.renderMenu(pdf)}
            </span>
        }
      </div>
    </li>;
  }

  render = () => {
    const nOfDue = this.state.pdfs.reduce((sum, p) => sum + p.nOfDueBookmarks, 0);
    const upload = this.state.upload;
    const selected = this.state.selectedFolder;
    const pdfs = this.state.pdfs.filter((p) => (selected === 'unsorted' ? !p.folderId : p.folderId === selected));
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
              <input id="pdf-upload" type="file" accept="application/pdf,.pdf,application/epub+zip,.epub" multiple onChange={this.onFileChosen} disabled={!!upload}/>
              {upload ? `Uploading… ${Math.round(100 * upload.loaded / (upload.total || 1))}%` : '+ Add book'}
            </label>
          </div>
        </div>

        {this.state.status === 'success' && this.renderFolders()}

        {this.state.uploadError && <p className="error">{this.state.uploadError}</p>}

        {
          this.state.status === 'loading' ? <p className="empty">Loading…</p> :
          this.state.status === 'failure' ? <p className="error">Couldn't load your books - check your connection.</p> :
          this.state.pdfs.length === 0 ? <p className="empty">No books yet. Add a PDF or EPUB to start reading.</p> :
          pdfs.length === 0 ? <p className="empty">{selected === 'unsorted' ? 'Every book is in a folder.' : 'No books in this folder yet.'}</p> :
          <ul className="pdfs">{pdfs.map(this.renderPdf)}</ul>
        }

        {
          this.state.bookmarksPdf &&
          <BookmarksModal
            pdfId={this.state.bookmarksPdf.id}
            title={this.state.bookmarksPdf.title}
            onOpenInBook={(focus) => this.props.history.push(`/pdfs/${this.state.bookmarksPdf.id}`, { focus })}
            onBookmarkRemoved={this.load}
            onClose={() => this.setState({ bookmarksPdf: null })}
          />
        }
      </div>
    </Main>;
  }
}

export default withRouter(Page_pdfs);
