import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactModal from 'react-modal';
import ErrorBoundary from '~/components/ErrorBoundary';

import css from './index.scss';

class TogglerAndModal extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
    toggler: PropTypes.element.isRequired,
    className: PropTypes.string,

    afterClose: PropTypes.func,
  }

  static defaultProps = {
    afterClose: () => {},
    className: ''
  }

  state = {
    isOpen: false,
  }

  openModal = () => {
    this.setState({ isOpen: true });
  }

  closeModal = () => {
    // Make .closeModal() thenable!
    return new Promise((resolve) => {
      this.setState({ isOpen: false }, () => {
        setTimeout(() => {
          // Resolve when 300ms animations are over!
          resolve();

          // And a prop for a general clean up when modal closes, no matter the way it was closed!
          this.props.afterClose();
        }, 300);
      });
    });
  }

  renderChildren = () => {
    if (typeof this.props.children === 'object') {
      return this.props.children;
    } else if (typeof this.props.children === 'function') {
      return this.props.children(this.closeModal);
    }
  }

  renderError = () =>
    <div className="modal">
      <div className="modal__header">
        <h2 className="modal__title">
          Error
        </h2>
      </div>

      <div className="modal__content">
        Sorry, something is wrong :-(
      </div>
    </div>

  renderCloseButton = () =>
    <button
      className="close-button"
      type="button"
      aria-label="Close"
      onClick={this.closeModal}
    >
      <span aria-hidden="true">×</span>
    </button>

  renderModal = () =>
    <ReactModal
      isOpen={this.state.isOpen}
      // Called when overlay is clicked, or ESC is pressed
      onRequestClose={this.closeModal}

      // It's important that we use both of these 'className' props, because otherwise default styles will be used!
      overlayClassName={css.modalOverlay}
      className={`${css.modalWrapper} ${this.props.className}`}
      // Otherwise close animations won't work (but open animations still will)
      closeTimeoutMS={300}
    >
      {this.renderCloseButton()}

      <ErrorBoundary renderError={this.renderError}>
        {this.renderChildren()}
      </ErrorBoundary>
    </ReactModal>

  renderToggler = () =>
    React.cloneElement(
      this.props.toggler,
      { onClick: this.openModal }
    )

  render = () =>
    <React.Fragment>
      {this.renderToggler()}
      {this.renderModal()}
    </React.Fragment>
}

export default TogglerAndModal;
