import css from './index.css';

class Cheatsheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ifShown: false
    };
  }

  toggle = () =>
    this.setState({ ifShown: !this.state.ifShown })

  render = () =>
    <section className={`cheatsheet ${css.cheatsheet}`}>
      <div className="toggler" onClick={this.toggle}>
        ?
      </div>
      {
        this.state.ifShown &&
        <div className="modal">
          <table onClick={this.toggle}>
            <tbody>
              <tr>
                <td>CTRL+S</td>
                <td>will save the new flashcard. Existing flashcards will also get saved automatically when you remove the focus away from them.</td>
              </tr>
              <tr>
                <td>CTRL+B</td>
                <td>bold text</td>
              </tr>
              <tr>
                <td>CTRL+K</td>
                <td>code block</td>
              </tr>
            </tbody>
          </table>
        </div>
      }
    </section>
}

export { Cheatsheet };
