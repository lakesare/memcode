import { Link } from 'react-router-dom';
import css from './index.css';

const Footer = () =>
  <footer className={css.footer}>
    <div className="container">
      <section className="blog-links">
        <Link to="/contact">Contact</Link>
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
export { Footer };
export default Footer;
