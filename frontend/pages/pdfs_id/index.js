import withRouter from '~/services/withRouter';
import PdfReader from '~/appComponents/PdfReader';

class Page_pdfs_id extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  }

  // [claude comment] the library's bookmarks modal opens the book at a bookmark by passing it as router state
  focusFromLibrary = () => {
    const focus = this.props.location.state && this.props.location.state.focus;
    return focus ? { ...focus, key: `library-${focus.bookmarkId}` } : null;
  }

  render = () =>
    <PdfReader key={this.props.match.params.id} pdfId={this.props.match.params.id} focus={this.focusFromLibrary()}/>
}

export default withRouter(Page_pdfs_id);
