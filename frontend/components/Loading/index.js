// spe stands for Request Success Failure

// if this.props.children doesn't depend on resulting payload, use as:
// <Loading spe={apiGetProfile}>
//   <section>
//     <h3>yay! loaded!</h3>
//   </section>
// </Loading>

// if this.props.children depends on resulting payload - use:
// <Loading spe={apiGetProfile}>{payload => {
//   <h3>{payload.firstName}</h3>
// }</Loading>

import React from 'react';

import * as customPropTypes from '~/services/customPropTypes';
import css from './index.css';

const Loading = (props) => {
  switch (props.spe.status) {
    case 'request':
      return (
        <div className={`${css.loading} request`}>
          <i className="fa fa-circle-o-notch fa-spin fa-2x fa-fw" />
        </div>
      );
    case 'success':
      switch (typeof props.children) {
        case 'function':  return props.children(props.spe.payload);
        default:          return props.children;
      }
    case 'failure':
      return <div className={`${css.loading} error`}>{props.spe.error}</div>;
    default:
      return null;
  }
};

Loading.defaultProps = {
  children: null
};

Loading.propTypes = {
  spe: customPropTypes.spe.isRequired,
  children: React.PropTypes.any // can be null, or false, or element
};

export { Loading };
