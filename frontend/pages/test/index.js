import { commonFetch } from '~/api/commonFetch';

class Page_test extends React.Component {
  state = { html: 'I know what you mean' }

  migrate = () => {
    commonFetch(() => {},
      'PUT', '/api/admin/migrate-to-quill'
    );
  }

  render = () =>
    <div className="container">
      <button className="button black" onClick={this.migrate}>Migrate to quill</button>
    </div>
}

export default Page_test;
