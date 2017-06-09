import memcode_1 from './memcode_1.gif';
import memcode_2 from './memcode_2.gif';

import css from './index.css';

class Instructions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentType: 'INLINED ANSWERS'
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
    <section className={`instructions ${css.instructions}`}>
      <h3 className="there-are-two-types">There are 2 types of flashcards you can create:</h3>
      <nav>
        {this.renderNavItem('INLINED ANSWERS')}
        {this.renderNavItem('SEPARATE ANSWER')}
      </nav>

      <div className="current-type">
        {
          this.state.currentType === 'INLINED ANSWERS' &&
          <div className="gif-and-text">
            <img src={`/${memcode_1}`}/>
            <div className="text">
              <p className="description">This is an <b>insert answer inline flashcard</b>.</p>
              <ol>
                <li><b>In the first column, type in some phrase with words you'd have to fill in eventually</b> (eg, to learn the word 'turmoil': 'The country has been in turmoil for the past 10 years.')</li>
                <li>We'd like to memorize the word turmoil.<b> Select 'turmoil' with your mouse, and press ENTER.</b></li>
                <li>In the second column, type in some additional information if needed (eg definition of the word 'turmoil': 'Сondition of extreme confusion, agitation.')</li>
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
                <li><b>In the first column, type in your question</b> (eg: 'Why is Pluto no longer considered a planet?')</li>
                <li><b>In the second column, type in your answer</b> (eg: 'Because there were discovered many celestial objects of comparable size next to Pluto.')</li>
                <li><b>Press CTRL+S to save</b> the new flashcard.</li>
              </ol>
            </div>
          </div>
        }
      </div>

      <p>
        Press <b>CTRL+S</b> to save the new flashcard. When you edit already created flashcards, they are saved automatically.
      </p>
      <p>
        Formatting and image insertion are available, click on the question mark for a quick cheatsheet.
      </p>
    </section>
}

export { Instructions };
