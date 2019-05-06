const Heading = ({ text }) =>
  <h2 className="section-heading">{text}</h2>;

Heading.propTypes = {
  text: PropTypes.string.isRequired
};

export { Heading };
