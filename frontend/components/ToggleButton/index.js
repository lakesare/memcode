import css from './index.scss';

class ToggleButton extends React.Component {
  static propTypes = {
    value: PropTypes.oneOf(['left', 'right']).isRequired,
    updateValue: PropTypes.func.isRequired
  }

  render = () =>
    <button
      className={`${css.button} toggle-button ${this.props.value === 'right' ? "-left" : "-right"}`}
      type="button"
      onClick={() => this.props.updateValue(this.props.value === 'left' ? 'right' : 'left')}
    >
      <div className="toggle-button-label-left"/>
      <div className="toggle-button-label"/>
    </button>
}

export default ToggleButton;
