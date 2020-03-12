import ToggleButton from '~/components/ToggleButton';

class ThemeToggleButton extends React.Component {
  state = {
    value: (localStorage.getItem('theme') || 'dark') === 'dark' ? 'right' : 'left'
  }

  componentDidMount = () => {
    this.uiUpdateBody(this.state.value);
  }

  uiUpdateBody = (value) => {
    const bodyEl = document.body;
    if (value === 'left') {
      bodyEl.classList.add("-bright-theme");
    } else {
      bodyEl.classList.remove("-bright-theme");
    }
  }

  updateValue = (value) => {
    localStorage.setItem('theme', value === 'right' ? 'dark' : 'bright');
    this.setState({ value });
    this.uiUpdateBody(value);
  }

  render = () =>
    <ToggleButton
      value={this.state.value}
      updateValue={this.updateValue}
    />
}

export default ThemeToggleButton;
