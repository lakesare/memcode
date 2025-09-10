import { connect } from 'react-redux';
import ToggleButton from '~/components/ToggleButton';
import SettingsDuck from '~/ducks/SettingsDuck';

@connect(
  (state) => ({
    theme: state.global.Settings.theme
  }),
  (dispatch) => ({
    SettingsActions: SettingsDuck.getActions(dispatch)
  })
)
class ThemeToggleButton extends React.Component {
  static propTypes = {
    theme: PropTypes.string.isRequired,
    SettingsActions: PropTypes.object.isRequired
  }

  updateValue = (value) => {
    const newTheme = this.props.theme === 'dark' ? 'bright' : 'dark';
    this.props.SettingsActions.updateSetting('theme', newTheme);
  }

  render = () =>
    <ToggleButton
      value={this.props.theme === 'dark' ? 'right' : 'left'}
      updateValue={this.updateValue}
    />
}

export default ThemeToggleButton;
