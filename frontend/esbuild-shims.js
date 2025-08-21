// React and PropTypes globals
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Make React, PropTypes, and connect available globally
window.React = React;
window.PropTypes = PropTypes;
window.connect = connect;

// Quill global
import Quill from 'quill';
window.Quill = Quill;

// Process polyfill for browser
if (typeof process === 'undefined') {
  window.process = {
    env: {},
    browser: true
  };
}

// Buffer polyfill
import { Buffer } from 'buffer';
if (typeof window.Buffer === 'undefined') {
  window.Buffer = Buffer;
}
