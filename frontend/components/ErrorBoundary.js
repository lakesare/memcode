import React from 'react';
import PropTypes from 'prop-types';

// Partially taken from https://reactjs.org/docs/error-boundaries.html
class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    renderError: PropTypes.func.isRequired,
  }

  static defaultProps = {
    renderError: () => <h1 className="loading -failure">Something went wrong :-(.<br/><br/> Please try to refresh the page (CMD+SHIFT+R). <br/><br/> If the error persists - please write to contact@memcode.com. </h1>,
  }

  state = { ifHasError: false }

  componentDidCatch = () => {
    this.setState({ ifHasError: true });
    // We don't need to do anything here, because both (error, errorInfo) are already logged!
  }

  render = () => {
    if (this.state.ifHasError) {
      return this.props.renderError();
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
