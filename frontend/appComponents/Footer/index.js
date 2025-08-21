import css from './index.scss';

class Footer extends React.Component {
  render = () =>
    <footer className={css.footer}>
      <div className="container">
        <section className="blog-links">
          <a target="_blank" rel="noopener noreferrer" href="https://www.github.com/lakesare/memcode">Github</a>
          <span className="pipe">|</span>
          <a target="_blank" rel="noopener noreferrer" href="https://www.patreon.com/memcode">Patreon</a>
          <span className="pipe">|</span>
          <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/memcodeapp" className="twitter-link">
            <i className="fa fa-twitter" aria-hidden="true"/>
          </a>
        </section>

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
