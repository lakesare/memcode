import ToggleButton from '~/components/ToggleButton';
import ThemeUtil from '~/services/ThemeUtil';

class ThemeToggleButton extends React.Component {
  state = {
    value: (ThemeUtil.getCurrentTheme() === 'dark') ? 'right' : 'left'
  }

  updateValue = (value) => {
    const newTheme = ThemeUtil.toggleTheme();
    this.setState({ value: newTheme === 'dark' ? 'right' : 'left' });
  }

  render = () =>
    <ToggleButton
      value={this.state.value}
      updateValue={this.updateValue}
    />
}

export default ThemeToggleButton;
