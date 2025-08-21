import css from './index.scss';

class ProgressBar extends React.Component {
  static propTypes = {
    currentAmount: PropTypes.number.isRequired,
    maxAmount: PropTypes.number.isRequired,

    className: PropTypes.string
  }

  static defaultProps = {
    className: '',
  }

  getCurrentWidth = () =>
    ((this.props.currentAmount / this.props.maxAmount) * 100).toString() + '%'

  render = () =>
    <section
      className={`${this.props.className} ${css.ProgressBar}`}
      style={{ width: '100%' }}
    >
      <div className="inner" style={{ width: this.getCurrentWidth() }}/>
    </section>
}

export default ProgressBar;
