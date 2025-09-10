import TogglerAndModal from '~/components/TogglerAndModal';
import TabNavigation   from '~/components/TabNavigation';
import { AuthenticationActions } from '~/reducers/Authentication';
import MyDuck from '~/ducks/MyDuck';
import SettingsDuck from '~/ducks/SettingsDuck';
import Select from '~/components/Select';

import css from './index.scss';

@connect(
  (state) => ({
    currentUser: state.global.Authentication.currentUser || false,
    My: state.global.My,
    Settings: state.global.Settings
  }),
  (dispatch) => ({
    signOut: () => AuthenticationActions.signOut(dispatch),
    MyActions: dispatch(MyDuck.getActions),
    SettingsActions: SettingsDuck.getActions(dispatch)
  })
)
class SettingsModal extends React.Component {
  static propTypes = {
    toggler: PropTypes.element.isRequired,
    My: PropTypes.object.isRequired,
    Settings: PropTypes.object.isRequired,
    MyActions: PropTypes.object.isRequired,
    SettingsActions: PropTypes.object.isRequired,
    signOut: PropTypes.func.isRequired,
  }

  state = {
    selectedTab: 'Design'
  }

  componentDidMount = () => {}

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
        <h2 className="title">Page: Review</h2>

        <div className="settings">
          <div className="setting">
            <div className="comment">
              Links to Github and Patreon
            </div>
            <Select
              className="react-select -settings"
              value={this.props.Settings.hideSocialButtons}
              updateValue={(val) => this.props.SettingsActions.updateSetting('hideSocialButtons', val)}
              options={[
                { value: false, label: 'Show Social Buttons' },
                { value: true, label: 'Hide Social Buttons' },
              ]}
            />
          </div>

          <div className="setting">
            <div className="comment">
              Fill-In-Answer flashcards: when to reveal the answer
            </div>
            <Select
              className="react-select -settings"
              value={this.props.Settings.clozeDeletionMode}
              updateValue={(val) => this.props.SettingsActions.updateSetting('clozeDeletionMode', val)}
              options={[
                { value: 'typing', label: 'Require typing' },
                { value: 'clicking', label: 'Just click' },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="part-of-the-website">
        <h2 className="title">Page: Course Creation</h2>

        <div className="settings">
          <div className="setting">
            <div className="comment">
              Order of flashcards
            </div>
            <Select
              className="react-select -settings"
              value={this.props.Settings.flashcardOrder}
              updateValue={(val) => this.props.SettingsActions.updateSetting('flashcardOrder', val)}
              options={[
                { value: true, label: 'Oldest First' },
                { value: false, label: 'Newest First' },
              ]}
            />
          </div>

          <div className="setting">
            <div className="comment">
              Font for code blocks
            </div>
            <Select
              className="react-select -settings"
              value={this.props.Settings.ifMonospace}
              updateValue={(val) => this.props.SettingsActions.updateSetting('ifMonospace', val)}
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
