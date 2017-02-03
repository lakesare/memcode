import React from 'react';

const spe = React.PropTypes.shape({
  status:  React.PropTypes.string,
  payload: React.PropTypes.any,
  error:   React.PropTypes.string
});

export { spe };
