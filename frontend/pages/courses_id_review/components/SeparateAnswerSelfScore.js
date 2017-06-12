class SeparateAnswerSelfScore extends React.Component {
  static propTypes = {
    giveScore: PropTypes.func.isRequired,
    score: PropTypes.number.isRequired
  }

  renderStar = (value) =>
    <div
      className="star"
      onClick={() => this.props.giveScore(value)}
    >
      <div className={this.props.score >= value ? 'yellow' : 'grey'}/>
    </div>

  render = () =>
    <section className="self-score">
      <label className="rate-yourself">
        Rate your answer! (1 - 5)
      </label>
      <div className="stars">
        {this.renderStar(1)}
        {this.renderStar(2)}
        {this.renderStar(3)}
        {this.renderStar(4)}
        {this.renderStar(5)}
      </div>
    </section>
}

export { SeparateAnswerSelfScore };
