import React from 'react';
import PropTypes from 'prop-types';
import orFalse from '~/services/orFalse';

import css from './index.scss';

class StarRating extends React.Component {
  static propTypes = {
    rating: orFalse(PropTypes.number).isRequired,
    updateRating: PropTypes.func,

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
      className={(this.state.temporaryRating && (this.state.temporaryRating >= starN)) ? '-selected' : ''}
      onClick={() => this.props.updateRating(starN)}
      onMouseOver={() => this.setState({ temporaryRating: starN })}
    >
      ★
    </li>

  render = () =>
    <ul
      className={`${css.ul} ${this.props.className}`}
      onMouseOut={() => this.setState({ temporaryRating: this.props.rating })}
      style={this.props.readOnly ? { cursor: 'not-allowed', pointerEvents: 'none' } : {}}
    >
      {this.renderStar(1)}
      {this.renderStar(2)}
      {this.renderStar(3)}
      {this.renderStar(4)}
      {this.renderStar(5)}
    </ul>
}

export default StarRating;
