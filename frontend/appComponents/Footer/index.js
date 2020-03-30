import { Link } from 'react-router-dom';
import css from './index.css';

import ThemeToggleButton from '~/appComponents/ThemeToggleButton';

class Footer extends React.Component {
  render = () =>
    <footer className={css.footer}>
      <div className="container">
        <section className="blog-links">
          <Link to="/articles/comparison">Blog</Link>
          <span className="pipe">|</span>
          <Link to="/contact">Contact</Link>
          <span className="pipe">|</span>
          <a href="https://github.com/lakesare/memcode" target="_blank" rel="noopener noreferrer">Github</a>
        </section>

        <section className="email">
          {window.env.contactEmail}
          <i className="fa fa-heart"/>

          <ThemeToggleButton/>
        </section>
      </div>
    </footer>
}

// <Link to="/articles/comparison">Memrise VS Quizlet VS Brainscape</Link>
// <Link to="/articles/welcome">FAQ</Link>
// <span className="pipe">|</span>
export { Footer };
export default Footer;
