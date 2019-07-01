import * as customPropTypes from '~/services/customPropTypes';
import requestIcon from './requestIcon.svg';
import css from './index.css';

// spe stands for Request Success Failure
//
// if this.props.children doesn't depend on resulting payload, use as:
// <Loading spe={apiGetProfile}>
//   <section>
//     <h3>yay! loaded!</h3>
//   </section>
// </Loading>
//
// if this.props.children depends on resulting payload - use:
// <Loading spe={apiGetProfile}>{payload => {
//   <h3>{payload.firstName}</h3>
// }</Loading>
class Loading extends React.Component {
  static propTypes = {
    spe: customPropTypes.spe.isRequired,
    children: PropTypes.any, // can be null, or false, or element
    requestIcon: PropTypes.any,
    className: PropTypes.string,
    enabledStatuses: PropTypes.array
  }

  static defaultProps = {
    children: null,
    requestIcon: <img src={requestIcon} alt="Loading"/>,
    className: '',
    enabledStatuses: ['request', 'success', 'failure']
  }

  ifCurrentStatusIsNotEnabled = () =>
    !this.props.enabledStatuses.includes(this.props.spe.status)

  getClassName = (status) =>
    `${css.loading} ${this.props.className} loading -${status}`

  renderSuccess = () => {
    switch (typeof this.props.children) {
      case 'function': return this.props.children(this.props.spe.payload);
      default:         return this.props.children;
    }
  }

  renderRequest = () =>
    <div className={this.getClassName(this.props.spe.status)}>{this.props.requestIcon}</div>

  renderFailure = () =>
    <div className={this.getClassName(this.props.spe.status)}>{this.props.spe.error}</div>

  render = () => {
    if (this.ifCurrentStatusIsNotEnabled()) return null;

    switch (this.props.spe.status) {
      case 'request': return this.renderRequest();
      case 'failure': return this.renderFailure();
      case 'success': return this.renderSuccess();
      // spe is {}, request was not yet initiated
      default: return null;
    }
  }
}

export default Loading;
export { Loading };
