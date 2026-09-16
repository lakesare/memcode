const Site = ({ name, rating, answer, children }) =>
  <section className={`site -${name.toLowerCase()}`}>
    <h3 className="site-heading">
      <span className="site-name">{name}:</span>
      {rating !== undefined && <span className="rating">{rating}<span className="outOf">/5</span></span>}
      {answer !== undefined && <span className="answer">{answer}</span>}
    </h3>

    <div className="description">
      {children}
    </div>
  </section>;

Site.propTypes = {
  name:     PropTypes.string.isRequired,
  rating:   PropTypes.string,
  answer:   PropTypes.string,
  children: PropTypes.node.isRequired
};

export { Site };
