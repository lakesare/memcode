import StandardTooltip from '~/components/StandardTooltip';
import Rating from '~/components/Rating';

import css from './index.css';

class SeparateAnswerSelfScore extends React.Component {
  static propTypes = {
    score: PropTypes.number.isRequired,
    giveScore: PropTypes.func.isRequired
  }

  render = () =>
    <section className={`self-score ${css.section}`}>
      <label className="rate-yourself">
        Rate your answer <StandardTooltip tooltipEl="Don't be afraid to rate yourself poorly! It just means that we'll be offering you this flashcard for repeat more frequently."/>
      </label>

      <Rating
        className="stars"
        amountOfStars={5}
        renderStar={() => <div className="star"/>}

        rating={this.props.score}
        updateRating={this.props.giveScore}
      />
    </section>
}

export default SeparateAnswerSelfScore;
