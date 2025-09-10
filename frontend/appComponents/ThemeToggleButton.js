import { connect } from 'react-redux';
import ToggleButton from '~/components/ToggleButton';
import MyDuck from '~/ducks/MyDuck';

@connect(
  (state) => ({
    theme: state.global.My.theme
  }),
  (dispatch) => ({
    MyActions: dispatch(MyDuck.getActions)
  })
)
class ThemeToggleButton extends React.Component {
  static propTypes = {
    theme: PropTypes.string.isRequired,
    MyActions: PropTypes.object.isRequired
  }

  updateValue = (value) => {
    const newTheme = this.props.theme === 'dark' ? 'bright' : 'dark';
    this.props.MyActions.setTheme(newTheme);
  }

  render = () =>
    <ToggleButton
      value={this.props.theme === 'dark' ? 'right' : 'left'}
      updateValue={this.updateValue}
    />
}

export default ThemeToggleButton;
