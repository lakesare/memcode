import api from '~/api';

import Loading from '~/components/Loading';
import PageAdmin from '~/appComponents/PageAdmin';
import NotificationLi from '~/appComponents/Header/components/CurrentUser/components/NotificationsTogglerAndDropdown/components/NotificationLi';

import css from './index.css';

class Page extends React.Component {
  state = {
    speAnnounceAFeature: {},
    memcode_added_some_feature_notificationHtml: ''
  }

  apiAnnounceAFeature = () =>
    api.NotificationApi.announceNewFeature(
      {
        type: 'memcode_added_some_feature',
        content: {
          html: this.state.memcode_added_some_feature_notificationHtml
        }
      },
      (spe) => this.setState({ speAnnounceAFeature: spe })
    )

  render = () =>
    <PageAdmin title="Notifications">
      <div className={`standard-admin-sections ${css.sections}`}>
        <section className="standard-admin-section">
          <h2 className="standard-admin-section-title">Send everyone notification about the new feature</h2>

          <div className="space"/>
          <textarea
            style={{ border: '1px solid grey', width: 400, height: 60, padding: 10 }}
            value={this.state.memcode_added_some_feature_notificationHtml}
            onChange={(e) => this.setState({ memcode_added_some_feature_notificationHtml: e.target.value })}
          />

          <div className="space"/>
          <ul style={{ width: 400 }}>
            <NotificationLi
              notification={{
                id: 5,
                type: 'memcode_added_some_feature',
                ifRead: false,
                createdAtDiffFromNow: { minutes: -23 },
                content: {
                  html: this.state.memcode_added_some_feature_notificationHtml
                }
              }}
              apiMarkAsReadOrUnread={() => {}}
            />
          </ul>

          <div className="space"/>
          <button className="button -pink -small" type="submit" onClick={this.apiAnnounceAFeature}>
            Send Out
          </button>
          <Loading spe={this.state.speAnnounceAFeature}>{({ message }) => <span>{message}</span>}</Loading>
        </section>
      </div>
    </PageAdmin>
}

export default Page;
