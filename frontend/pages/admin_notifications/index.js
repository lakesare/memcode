import commonFetch from '~/api/commonFetch';

import Loading from '~/components/Loading';
import PageAdmin from '~/appComponents/PageAdmin';

import css from './index.css';

class Page extends React.Component {
  state = {
    speCreateNotificationsForExistingUsers: {}
  }

  apiCreateNotificationsForExistingUsers = () =>
    commonFetch(
      (spe) => this.setState({ speCreateNotificationsForExistingUsers: spe }),
      'POST', '/api/admin/temporary/create-notifications-for-existing-users'
    )

  render = () =>
    <PageAdmin title="Notifications">
      <div className={`standard-admin-sections ${css.sections}`}>
        <section className="standard-admin-section">
          <code>
            make db-restore
          </code>
          <button className="button -white -small" type="submit" onClick={this.apiCreateNotificationsForExistingUsers}>
            Create Notifications For Existing Users
          </button>

          <Loading spe={this.state.speCreateNotificationsForExistingUsers}>{({ message }) => <span>{message}</span>}</Loading>
        </section>
      </div>
    </PageAdmin>
}

export default Page;
