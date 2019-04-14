import { Link } from 'react-router-dom';
import css from './index.css';

const Footer = () =>
  <footer className={css.footer}>
    <div className="container">
      <section className="blog-links">
        <Link to="/articles/welcome">FAQ</Link>
        <span className="pipe">|</span>
        <Link to="/articles/comparison">Memrise VS Quizlet VS Brainscape</Link>
      </section>

      <section className="email">
        {window.env.contactEmail}
        <i className="fa fa-heart"/>
      </section>
    </div>
  </footer>;

export { Footer };
export default Footer;
