import React from 'react';

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
    <section className={css.instructions}>
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
                <td>will save the new meme, it will also get saved automatically when you click from one meme to another.</td>
              </tr>
              <tr>
                <td>CTRL+B</td>
                <td>bold text</td>
              </tr>
              <tr>
                <td>CTRL+K</td>
                <td>code block</td>
              </tr>
              <tr>
                <td>CTRL+ENTER</td>
                <td>soft newline inside of the code block</td>
              </tr>
            </tbody>
          </table>
        </div>
      }
    </section>
}

export { Instructions };
