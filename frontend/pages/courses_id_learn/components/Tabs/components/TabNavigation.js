class TabNavigation extends React.Component {
  static propTypes = {
    currentTab: PropTypes.string.isRequired,
    updateCurrentTab: PropTypes.func.isRequired
  }

  renderTabLink = (tabId, caption) =>
    <li
      className={this.props.currentTab === tabId ? '-active' : '-not-active'}
      onClick={() => this.props.updateCurrentTab(tabId)}
    >{caption}</li>

  renderInstructions = () => (
    {
      notLearned: <section className="instructions container">
        Mark flashcards as learned by clicking on them.<br/>
        As soon as you mark some flashcard as learned, you will be able to <em className="review">review</em> (that is, recall) it.
      </section>,
      ignored: <section className="instructions container">
        We won't ask you to <em className="review">review</em> flashcards that you marked as ignored, and you will not see them in the <em className="learn">'to learn'</em> list.<br/>
        You can start learning them again by clicking 'unignore'.
      </section>,
      learned: <section className="instructions container">
        These are the flashcards that you marked as <em className="learn">learned</em>, and we will be asking you to <em className="review">review</em> them from time to time.<br/>
        If you want to stop reviewing them - click 'unlearn', and then 'ignore'.
      </section>
    }[this.props.currentTab]
  )

  render = () =>
    <nav>
      <ul className="tab-links">
        {this.renderTabLink('learned', "Learned flashcards")}
        {this.renderTabLink('notLearned', 'Flashcards to learn')}
        {this.renderTabLink('ignored', 'Ignored flashcards')}
      </ul>

      {this.renderInstructions()}
    </nav>
}

export { TabNavigation };
