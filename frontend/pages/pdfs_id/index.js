import withRouter from '~/services/withRouter';
import PdfReader from '~/appComponents/PdfReader';

class Page_pdfs_id extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired
  }

  render = () =>
    <PdfReader key={this.props.match.params.id} pdfId={this.props.match.params.id}/>
}

export default withRouter(Page_pdfs_id);
