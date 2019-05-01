import React from 'react';
import PropTypes from 'prop-types';
import orFalse from '~/services/orFalse';

import Rating from '~/components/Rating';

import css from './index.scss';

class StarRating extends React.Component {
  static propTypes = {
    rating: orFalse(PropTypes.number).isRequired,
    updateRating: PropTypes.func,

    readOnly: PropTypes.bool
  }

  static defaultProps = {
    updateRating: () => {},
    readOnly: false
  }

  render = () =>
    <Rating
      className={`star-rating ${css.ul}`}
      amountOfStars={5}
      renderStar={() => '★'}

      rating={this.props.rating}
      updateRating={this.props.updateRating}
      readOnly={this.props.readOnly}
    />
}

export default StarRating;
