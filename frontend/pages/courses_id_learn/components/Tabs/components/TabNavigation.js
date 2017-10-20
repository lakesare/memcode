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
      notLearned: <section className="instructions">
        Mark flashcards as learned by clicking on them.<br/>
        As soon as you mark some flashcard as learned, you will be able to <b className="review">review</b> (that is, recall) it.
      </section>,
      ignored: <section className="instructions">
        We won't ask you to <b className="review">review</b> flashcards that you marked as ignored, and you will not see them in the <b className="learn">'to learn'</b> list.<br/>
        You can start learning them again by clicking 'unignore'.
      </section>,
      learned: <section className="instructions">
        These are the flashcards that you marked as <b className="learn">learned</b>, and we will be asking you to <b className="review">review</b> them from time to time.<br/>
        If you want to stop reviewing them - click 'unlearn', and then 'ignore'.
      </section>
    }[this.props.currentTab]
  )

  render = () =>
    <nav>
      <ul className="tab-links">
        {this.renderTabLink('notLearned', 'Flashcards to learn')}
        {this.renderTabLink('ignored', 'Ignored flashcards')}
        {this.renderTabLink('learned', "Learned flashcards")}
      </ul>

      {this.renderInstructions()}
    </nav>
}

export { TabNavigation };
