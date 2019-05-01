import _ from 'lodash';
import orFalse from '~/services/orFalse';

class Rating extends React.Component {
  static propTypes = {
    rating: orFalse(PropTypes.number).isRequired,
    updateRating: PropTypes.func,

    amountOfStars: PropTypes.number.isRequired,
    renderStar: PropTypes.func.isRequired,

    readOnly: PropTypes.bool,
    className: PropTypes.string
  }

  static defaultProps = {
    className: '',
    updateRating: () => {},
    readOnly: false
  }

  state = {
    temporaryRating: this.props.rating
  }

  renderStar = (starN) =>
    <li
      key={starN}
      className={(this.state.temporaryRating && (this.state.temporaryRating >= starN)) ? '-selected' : '-not-selected'}
      onClick={() => this.props.updateRating(starN)}
      onMouseOver={() => this.setState({ temporaryRating: starN })}
    >
      {this.props.renderStar()}
    </li>

  render = () =>
    <ul
      className={this.props.className}
      onMouseOut={() => this.setState({ temporaryRating: this.props.rating })}
      style={this.props.readOnly ? { cursor: 'not-allowed', pointerEvents: 'none' } : {}}
    >
      { // => [1, 2, 3, 4, 5]
        _.range(1, this.props.amountOfStars + 1).map(this.renderStar)
      }
    </ul>
}

export default Rating;
