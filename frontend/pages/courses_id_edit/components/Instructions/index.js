import memcode_1 from './memcode_1.gif';
import memcode_2 from './memcode_2.gif';
import add_to_learned_courses from './add_to_learned_courses.png';
import learn from './learn.png';
import review from './review.png';

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
      <div className="how-to-create">
        <h3>There are 2 types of flashcards you can create:</h3>
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
      </div>

      <div className="what-to-do-next">
        <h3>How do I learn my flashcards?</h3>
        <ul>
          <li>Click on <img src={`/${add_to_learned_courses}`}/>. This will display this course on your profile's page, and you'll get an access to learning and reviewing courses.</li>
          <li>Click on <img src={`/${learn}`}/>. Here you can read through the flashcards you created, and mark them as learned (if you feel like it) by clicking on them.</li>
          <li>Click on <img src={`/${review}`}/>. Repeat the flashcards you have learned!</li>
        </ul>
      </div>
    </section>
}

export { Instructions };
