import css from './index.css';

const Footer = () =>
  <footer className={css.footer}>
    <div className="container">
      {window.env.contactEmail}
      <i className="fa fa-envelope"/>
    </div>
  </footer>;

export { Footer };
