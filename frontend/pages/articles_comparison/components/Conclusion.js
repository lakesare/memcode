const Conclusion = ({ children }) =>
  <section className="conclusion">
    <h3>Conclusion</h3>

    <div className="description">
      {children}
    </div>
  </section>;

Conclusion.propTypes = {
  children: PropTypes.node.isRequired
};

export { Conclusion };
