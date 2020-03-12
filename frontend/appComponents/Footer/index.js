import { Link } from 'react-router-dom';
import css from './index.css';

import ToggleButton from '~/components/ToggleButton';

class Footer extends React.Component {
  state = {
    value: 'left'
  }

  render = () =>
    <footer className={css.footer}>
      <div className="container">
        <section className="blog-links">
          <Link to="/articles/comparison">Blog</Link>
          <span className="pipe">|</span>
          <Link to="/contact">Contact</Link>
          <span className="pipe">|</span>
          <a href="https://github.com/lakesare/memcode">Github</a>
        </section>

        <ToggleButton
          value={this.state.value}
          updateValue={(value) => this.setState({ value })}
        />

        <section className="email">
          {window.env.contactEmail}
          <i className="fa fa-heart"/>
        </section>
      </div>
    </footer>
}

// <Link to="/articles/comparison">Memrise VS Quizlet VS Brainscape</Link>
// <Link to="/articles/welcome">FAQ</Link>
// <span className="pipe">|</span>
export { Footer };
export default Footer;
