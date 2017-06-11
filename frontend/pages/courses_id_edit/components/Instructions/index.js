import css from './index.css';

import { HowToCreate } from './components/HowToCreate';
import { HowToLearn } from './components/HowToLearn';

class Instructions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openTab: null
    };
  }

  changeTab = (name) => {
    if (this.state.openTab === name) {
      this.setState({ openTab: null });
    } else {
      this.setState({ openTab: name });
    }
  }

  renderNavItem = (name, text) =>
    <div
      className={`nav-item ${this.state.openTab === name ? 'selected' : ''}`}
      onClick={() => this.changeTab(name)}
    >{text} <i className="fa fa-sort-desc"/></div>

  render = () =>
    <section className={`instructions ${css.instructions}`}>
      {this.renderNavItem('howToCreate', 'How to create a flashcard?')}
      {this.state.openTab === 'howToCreate' && <HowToCreate/>}

      {this.renderNavItem('howToLearn', 'How to learn a flashcard?')}
      {this.state.openTab === 'howToLearn' && <HowToLearn/>}
    </section>
}

export { Instructions };
