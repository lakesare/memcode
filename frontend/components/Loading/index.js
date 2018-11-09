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

import * as customPropTypes from '~/services/customPropTypes';
import requestIcon from './requestIcon.svg';
import css from './index.css';

const Loading = (props) => {
  if (!props.enabledStatuses.includes(props.spe.status)) return null;
  switch (props.spe.status) {
    case 'request':
      return (
        <div className={`${css.loading} ${props.className} loading request`}>
          {props.requestIcon}
        </div>
      );
    case 'success':
      switch (typeof props.children) {
        case 'function': return props.children(props.spe.payload);
        default:         return props.children;
      }
    case 'failure':
      return <div className={`${css.loading} ${props.className} loading error`}>{props.spe.error}</div>;
    default: // spe is {}, request was not yet initiated
      return null;
  }
};

Loading.defaultProps = {
  children: null,
  requestIcon: <img src={requestIcon}/>,
  className: '',
  enabledStatuses: ['request', 'success', 'failure']
};

Loading.propTypes = {
  spe: customPropTypes.spe.isRequired,
  children: PropTypes.any, // can be null, or false, or element
  requestIcon: PropTypes.any,
  className: PropTypes.string,
  enabledStatuses: PropTypes.array
};

export default Loading;
export { Loading };
