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
        Click flashcards to learn them.<br/>
        After learning some cards, switch to <em className="review">review</em> mode to test yourself.
      </section>,
      ignored: <section className="instructions container">
        We won't ask you to <em className="review">review</em> flashcards that you marked as ignored, and you will not see them in the <em className="learn">'to learn'</em> list.<br/>
        You can start learning them again by opening the 3-dot menu, and clicking <em className="ignore">UNIGNORE</em>.
      </section>,
      learned: <section className="instructions container">
        These are the flashcards that you marked as <em className="learn">learned</em>, and we will be asking you to <em className="review">review</em> them from time to time.<br/>
        If you want to stop reviewing them - open the 3-dot menu, and click <em className="ignore">ignore</em>.
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
