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
    <section className={`instructions ${css.instructions}`}>
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
                <td>will save the new meme, or update the existing one. Existing memes will also get saved automatically when you remove the focus away from them.</td>
              </tr>
              <tr>
                <td>insert image</td>
                <td>to insert image - CTRL+C one from somewhere, and CTRL+V into the editor.</td>
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

export { Instructions };
