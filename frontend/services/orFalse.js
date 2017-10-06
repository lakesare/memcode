import PropTypes from 'prop-types';

// ___use as:
// selectedItem: orFalse(PropTypes.string).isRequired,
// ___why?
// because on hi.isRequired. and hi = null React will
// 1. will issue a warning about prop not being passed
// 2. not use default props!
// so we need to use `false` instead.
const orFalse = (propType) =>
  PropTypes.oneOfType([PropTypes.oneOf([false]), propType]);

export { orFalse };
