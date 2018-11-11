import { Link } from 'react-router';
import css from './index.css';

const Footer = () =>
  <footer className={css.footer}>
    <div className="container">
      <div className="faq">
        <i className="fa fa-anchor"/>
        <Link to="/articles/welcome">FAQ</Link>
      </div>

      <div className="email">
        {window.env.contactEmail}
        <i className="fa fa-heart"/>
      </div>
    </div>
  </footer>;

export { Footer };
export default Footer;
