const Heading = ({ text }) =>
  <h2 className="section-heading"><i className="fa fa-superpowers"/>{text}</h2>;

Heading.propTypes = {
  text: PropTypes.string.isRequired
};

export { Heading };
