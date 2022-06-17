import TogglerAndModal from '~/components/TogglerAndModal';
import TabNavigation   from '~/components/TabNavigation';
import { AuthenticationActions } from '~/reducers/Authentication';
import MyDuck from '~/ducks/MyDuck';

import css from './index.scss';

@connect(
  (state) => ({
    currentUser: state.global.Authentication.currentUser || false,
    My: state.global.My
  }),
  (dispatch) => ({
    signOut: () => AuthenticationActions.signOut(dispatch),
    MyActions: dispatch(MyDuck.getActions)
  })
)
class SettingsModal extends React.Component {
  static propTypes = {
    toggler: PropTypes.element.isRequired,
    My: PropTypes.object.isRequired,
    MyActions: PropTypes.object.isRequired,
    signOut: PropTypes.func.isRequired,
  }

  state = {
    selectedTab: 'Design',
    hideSocialButtons: localStorage.getItem('hideSocialButtons') === 'true' ? true : false
  }

  componentDidMount = () => {
    this.uiUpdateBody('hideSocialButtons', this.state.hideSocialButtons);
  }

  uiUpdateBody = (what, value) => {
    const bodyEl = document.body;
    if (value) {
      bodyEl.classList.add('-' + what);
    } else {
      bodyEl.classList.remove('-' + what);
    }
  }

  toggleValue = (what) => {
    const newValue = !this.state[what];
    localStorage.setItem(what, newValue);
    this.setState({ [what]: newValue });
    this.uiUpdateBody(what, newValue);
  }

  renderTabNavigation = () =>
    <TabNavigation
      selectTab={(selectedTab) => this.setState({ selectedTab })}
      selectedTab={this.state.selectedTab}
      tabs={['Design', 'Manage']}
    />

  renderSelectedTab = () => {
    return {
      'Design': this.renderDesignTab,
      'Manage': this.renderManageTab
    }[this.state.selectedTab]();
  }

  renderManageTab = () =>
    <div className="manage-tab">
      <h2 className="title">Sign out of your account</h2>
      <button
        type="button"
        className="button -white"
        onClick={this.props.signOut}
      >
        Sign Out
      </button>
    </div>

  renderDesignTab = () =>
    <div className="design-tab">
      <section className="part-of-the-website">
        <h2 className="title">Review page</h2>

        <div className="settings">
          <div className="setting">
            <div className="comment">
              Whether the links to Memcode's Github and Patreon pages (you might want them visible, they are cute!).
            </div>
            <button className="button -white" onClick={() => this.toggleValue('hideSocialButtons')} type="button">
              {
                this.state.hideSocialButtons ?
                  'Show Social Buttons' :
                  'Hide Social Buttons'
              }
            </button>
          </div>

          <div className="setting">
            <div className="comment">
              Whether to show the draft text area for Question&Answer flashcards.
            </div>
            <button
              type="button"
              className="button -white"
              onClick={this.props.MyActions.switchIfShowDraft}
            >
              {this.props.My.ifShowDraft ? 'Hide Draft' : 'Show Draft'}
            </button>
          </div>
        </div>
      </section>

      <section className="part-of-the-website">
        <h2 className="title">Course edit page</h2>

        <div className="settings">
          <div className="setting">
            <div className="comment">
              Whether to show the most recently created flashcards first, or the oldest flashcards first.
            </div>
            <button
              type="button"
              className="button -white"
              onClick={this.props.MyActions.switchFlashcardOrder}
            >
              {this.props.My.flashcardOrder ? 'Oldest First' : 'Newest First'}
            </button>
          </div>

          <div className="setting">
            <div className="comment">
              Whether to render code excerpts in monospace font.
            </div>
            <button
              type="button"
              className="button -white"
              onClick={this.props.MyActions.switchIfMonospace}
            >
              {this.props.My.ifMonospace ? 'To normal font' : 'To monospace'}
            </button>
          </div>
        </div>
      </section>
    </div>

  render = () =>
    <TogglerAndModal toggler={this.props.toggler}>{() =>
      <section className={`standard-modal standard-modal--md ${css.local}`}>
        <div className="standard-modal__header">
          <h2 className="standard-modal__title">Settings</h2>
          {this.renderTabNavigation()}
        </div>

        <div className="standard-modal__main">
          {this.renderSelectedTab()}
        </div>
      </section>
    }</TogglerAndModal>
}

export default SettingsModal;
