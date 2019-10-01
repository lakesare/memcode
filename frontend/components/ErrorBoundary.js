import React from 'react'
import PropTypes from 'prop-types'

// Partially taken from https://reactjs.org/docs/error-boundaries.html
class ErrorBoundary extends React.Component {
  static propTypes = {
    children   : PropTypes.node.isRequired,
    renderError: PropTypes.func.isRequired,
  }

  static defaultProps = {
    renderError: () =>
      <h1>Something went wrong. #todo</h1>,
  }

  state = { ifHasError: false }

  static getDerivedStateFromError () {
    // Update state so the next render will show the fallback UI.
    return { ifHasError: true }
  }

  componentDidCatch () {
    // We don't need to do anything here, because both (error, errorInfo) are already logged!
  }

  render () {
    if (this.state.ifHasError) {
      return this.props.renderError()
    } else {
      return this.props.children
    }
  }
}

export default ErrorBoundary
