import { Link } from 'react-router-dom';
import css from './index.css';

import ThemeToggleButton from '~/appComponents/ThemeToggleButton';

var target="_blank"; // to launch link in new tab
var rel="noopener noreferrer"; // recommended when link refers to external site

class Footer extends React.Component {
  render = () =>
    <footer className={css.footer}>
      <div className="container">
        <section className="blog-links">
          <Link to="/articles/comparison" target={target}>Blog</Link>
          <span className="pipe">|</span>
          <Link to="/contact" target={target}>Contact</Link>
          <span className="pipe">|</span>
          <a href="https://github.com/lakesare/memcode" target={target} rel={rel}>Github</a>
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
