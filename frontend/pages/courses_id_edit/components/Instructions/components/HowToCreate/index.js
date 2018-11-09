import memcode_1 from './memcode_1.gif';
import memcode_2 from './memcode_2.gif';

class HowToCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentType: 'QUESTION ANSWER',
    };
  }

  renderNavItem = (type) =>
    <div
      className={`type ${this.state.currentType === type ? 'selected' : ''}`}
      onClick={() => this.setState({ currentType: type })}
    >
      <div className="title">{type}</div>
    </div>

  render = () =>
    <div className="how-to-create">
      <nav>
        {this.renderNavItem('QUESTION ANSWER')}
        {this.renderNavItem('FILL-IN ANSWER')}
      </nav>

      <div className="current-type">
        {
          this.state.currentType === 'FILL-IN ANSWER' &&
          <div className="gif-and-text">
            <img src={memcode_1}/>
            <div className="text">
              <p className="description"><i className="fa fa-heart"/> This is an <b>insert answer inline flashcard</b>.</p>
              <ol>
                <li>
                  <b>1st column: Type in a sentence</b> (e.g. 'The country has been in turmoil for the past 10 years.')<br/>
                  <b>Select</b> the word you want to memorize <b>and click "Mark As Answer"</b>
                </li>
                <li>We'd like to memorize the word turmoil.<b> Select 'turmoil' with your mouse, and click 'Mark As Answer'.</b></li>
                <li>2nd column: Type in hint if needed (e.g. definition of the word 'turmoil': 'Сondition of extreme confusion, agitation.')</li>
                <li><b>Press CTRL+S to save</b> your flashcard.</li>
              </ol>
            </div>
          </div>
        }

        {
          this.state.currentType === 'QUESTION ANSWER' &&
          <div className="gif-and-text">
            <img src={memcode_2}/>
            <div className="text">
              <p className="description"><i className="fa fa-heart"/> This is a <b>classic flashcard</b>.</p>
              <ol>
                <li><b>1st column: Type in your question</b> (eg: 'Why is Pluto no longer considered a planet?')</li>
                <li><b>2nd column: Type in your answer</b> (eg: ' Because many celestial objects of comparable size were discovered near Pluto')</li>
                <li><b>Press CTRL+S to save</b> your flashcard.</li>
              </ol>
            </div>
          </div>
        }
      </div>
    </div>

}

export { HowToCreate };
