import memcode_1 from './memcode_1.gif';
import memcode_2 from './memcode_2.gif';

class HowToCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentType: 'SEPARATE ANSWER',
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
        {this.renderNavItem('SEPARATE ANSWER')}
        {this.renderNavItem('INLINED ANSWERS')}
      </nav>

      <div className="current-type">
        {
          this.state.currentType === 'INLINED ANSWERS' &&
          <div className="gif-and-text">
            <img src={`/${memcode_1}`}/>
            <div className="text">
              <p className="description">This is an <b>insert answer inline flashcard</b>.</p>
              <ol>
                <li><b>1st column: type in some phrase with words you'd have to fill in eventually</b> (eg, to learn the word 'turmoil': 'The country has been in turmoil for the past 10 years.')</li>
                <li>We'd like to memorize the word turmoil.<b> Select 'turmoil' with your mouse, and press ENTER.</b></li>
                <li>2nd column: type in some additional information if needed (eg definition of the word 'turmoil': 'Сondition of extreme confusion, agitation.')</li>
                <li><b>Press CTRL+S to save</b> the new flashcard.</li>
              </ol>
            </div>
          </div>
        }

        {
          this.state.currentType === 'SEPARATE ANSWER' &&
          <div className="gif-and-text">
            <img src={`/${memcode_2}`}/>
            <div className="text">
              <p className="description">This is a <b>classic flashcard</b>.</p>
              <ol>
                <li><b>1st column: type in your question</b> (eg: 'Why is Pluto no longer considered a planet?')</li>
                <li><b>2nd column: type in your answer</b> (eg: 'Because there were discovered many celestial objects of comparable size next to Pluto.')</li>
                <li><b>Press CTRL+S to save</b> the new flashcard.</li>
              </ol>
            </div>
          </div>
        }
      </div>
    </div>

}

export { HowToCreate };
