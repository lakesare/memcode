// React and PropTypes globals
export { default as React } from 'react';
export { default as PropTypes } from 'prop-types';
export { connect } from 'react-redux';

// Buffer polyfill
import { Buffer } from 'buffer';
if (typeof window.Buffer === 'undefined') {
  window.Buffer = Buffer;
}
