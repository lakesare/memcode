import TogglerAndModal from '~/components/TogglerAndModal';
import TabNavigation   from '~/components/TabNavigation';
import { AuthenticationActions } from '~/reducers/Authentication';
import MyDuck from '~/ducks/MyDuck';
import Select from '~/components/Select';

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
              Show the links to Memcode's Github and Patreon pages?
            </div>
            <Select
              className="react-select -settings"
              value={this.state.hideSocialButtons}
              updateValue={(val) => {
                localStorage.setItem('hideSocialButtons', val);
                this.setState({ hideSocialButtons: val });
                this.uiUpdateBody('hideSocialButtons', val);
              }}
              options={[
                { value: false, label: 'Show Social Buttons' },
                { value: true, label: 'Hide Social Buttons' },
              ]}
            />
          </div>

          <div className="setting">
            <div className="comment">
              Fill-In-Answer flashcards: should we ask you to type in the answer?
            </div>
            <Select
              className="react-select -settings"
              value={this.props.My.clozeDeletionMode}
              updateValue={(val) => {
                if (val !== this.props.My.clozeDeletionMode) {
                  this.props.MyActions.switchClozeDeletionMode();
                }
              }}
              options={[
                { value: 'typing', label: 'Require typing' },
                { value: 'clicking', label: 'Just click' },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="part-of-the-website">
        <h2 className="title">Course edit page</h2>

        <div className="settings">
          <div className="setting">
            <div className="comment">
              Show the oldest flashcards first?
            </div>
            <Select
              className="react-select -settings"
              value={this.props.My.flashcardOrder}
              updateValue={(val) => {
                if (val !== this.props.My.flashcardOrder) {
                  this.props.MyActions.switchFlashcardOrder();
                }
              }}
              options={[
                { value: true, label: 'Oldest First' },
                { value: false, label: 'Newest First' },
              ]}
            />
          </div>

          <div className="setting">
            <div className="comment">
              Render code blocks in monospace font?
            </div>
            <Select
              className="react-select -settings"
              value={this.props.My.ifMonospace}
              updateValue={(val) => {
                if (val !== this.props.My.ifMonospace) {
                  this.props.MyActions.switchIfMonospace();
                }
              }}
              options={[
                { value: true, label: 'Monospace' },
                { value: false, label: 'Normal' },
              ]}
            />
          </div>
        </div>
      </section>
    </div>

  render = () =>
    <TogglerAndModal toggler={this.props.toggler}>{() =>
      <section className={`standard-modal ${css.local}`}>
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
