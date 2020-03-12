import css from './index.scss';

class ToggleButton extends React.Component {
  static propTypes = {
    value: PropTypes.oneOf(['left', 'right']).isRequired,
    updateValue: PropTypes.func.isRequired
  }

  render = () =>
    // <button
    //   className={`switch ${this.props.value === 'right' ? "switch_is-on" : "switch_is-off"}`}
    //   type="button"
    //   onClick={() => this.props.updateValue(this.props.value === 'left' ? 'right' : 'left')}
    // >
    //   <div className={`toggle-button ${this.props.value === 'right' ? "toggle-button_position-right" : "toggle-button_position-left"}`}/>
    // </button>

    <div class="wrapper">
      <input type="checkbox" name="checkbox" class="switch"/>
    </div>

}

export default ToggleButton;
