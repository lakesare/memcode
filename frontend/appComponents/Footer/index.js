import { Link } from 'react-router-dom';
import css from './index.css';

const Footer = () =>
  <footer className={css.footer}>
    <div className="container">
      <section className="blog-links">
        <Link to="/articles/welcome">Welcome</Link>
        <span className="pipe">|</span>
        <Link to="/articles/comparison">Memcode VS Other Sites</Link>
        <span className="pipe">|</span>
        <Link to="/contact">Contact</Link>
        <span className="pipe">|</span>
        <a href="https://github.com/lakesare/memcode">Github</a>
      </section>

      <section className="email">
        {window.env.contactEmail}
        <i className="fa fa-heart"/>
      </section>
    </div>
  </footer>;

// <Link to="/articles/comparison">Memrise VS Quizlet VS Brainscape</Link>
// <Link to="/articles/welcome">FAQ</Link>
// <span className="pipe">|</span>
export default Footer;
