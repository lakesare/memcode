import memcode_1 from './memcode_1.gif';
import memcode_2 from './memcode_2.gif';

import css from './index.css';

class Instructions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ifShown: false
    };
  }

  toggle = () =>
    this.setState({ ifShown: !this.state.ifShown })

  render = () =>
    <section className={`instructions ${css.instructions}`}>
      <h3 className="there-are-two-types">There are 2 types of flashcards you can create:</h3>
      <ol className="two-types">
        <li>
          <h3><div className="type">INLINED ANSWERS</div> insert answer inline flashcard</h3>

          <div className="how-to-create-and-gif">
            <img src={`/${memcode_1}`}/>
            <ol className="how-to-create">
              <li><b>In the first column, type in some phrase with words you'd have to fill in eventually</b> (eg, to learn the word 'turmoil': 'The country has been in turmoil for the past 10 years.')</li>
              <li>We'd like to memorize the word turmoil.<b> Select 'turmoil' with your mouse, and press ENTER.</b></li>
              <li>In the second column, type in some additional information if needed (eg definition of the word 'turmoil': 'Сondition of extreme confusion, agitation.')</li>
              <li><b>Press CTRL+S to save</b> the new flashcard.</li>
            </ol>
          </div>
        </li>
        <li>
          <h3><div className="type">SEPARATE ANSWER</div> classical flashcard</h3>

          <div className="how-to-create-and-gif">
            <img src={`/${memcode_2}`}/>
            <ol className="how-to-create">
              <li><b>In the first column, type in your question</b> (eg: 'Why is Pluto no longer considered a planet?')</li>
              <li><b>In the second column, type in your answer</b> (eg: 'Because there were discovered many celestial objects of comparable size next to Pluto.')</li>
              <li><b>Press CTRL+S to save</b> the new flashcard.</li>
            </ol>
          </div>
        </li>
      </ol>

      <p>
        Press <b>CTRL+S</b> to save the new flashcard. When you edit already created flashcards, they are saved automatically.
      </p>
      <p>
        Formatting and image insertion are available, click on the question mark for a quick cheatsheet.
      </p>
    </section>
}

export { Instructions };
