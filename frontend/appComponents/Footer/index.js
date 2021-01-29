import { Link } from 'react-router-dom';
import css from './index.css';

import ThemeToggleButton from '~/appComponents/ThemeToggleButton';
import GitHubButton from 'react-github-btn';

class Footer extends React.Component {
  render = () =>
    <footer className={css.footer}>
      <div className="container">
        <section className="blog-links">
          <Link to="/contact">Contact</Link>
          <span className="pipe">|</span>
          <a target="_blank" rel="noopener noreferrer" href="https://www.patreon.com/memcode">Patreon</a>
          <span className="pipe">|</span>
          <div className="star-us">
            <GitHubButton href="https://github.com/lakesare/memcode" data-icon="octicon-star" data-show-count="true" aria-label="Star lakesare/memcode on GitHub">Star</GitHubButton>
          </div>
          <span className="pipe">|</span>
          <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/memcodeapp" className="twitter-link">
            <i className="fa fa-twitter" aria-hidden="true"/>
          </a>
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
