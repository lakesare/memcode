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

  constructor(props) {
    super(props);
    this.ratingRef = React.createRef();
  }

  state = {
    temporaryRating: this.props.rating
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.updateRatingOnArrows, false);
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.updateRatingOnArrows, false);
  }

  updateRatingOnArrows = (e) => {
    switch (e.which) {
      case 37: { // left
        if (this.props.rating > 1) {
          const newRating = this.props.rating - 1;
          this.props.updateRating(newRating);
          this.setState({ temporaryRating: newRating });
        }
        // { behavior: 'smooth' } doesn't work in chrome no matter what I do, polyfill doesn't help.
        this.ratingRef.current.scrollIntoView();
        break;
      }
      case 39: { // right
        if (this.props.rating < 5) {
          const newRating = this.props.rating + 1;
          this.props.updateRating(newRating);
          this.setState({ temporaryRating: newRating });
        }
        this.ratingRef.current.scrollIntoView();
        break;
      }
    }
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
      ref={this.ratingRef}
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
