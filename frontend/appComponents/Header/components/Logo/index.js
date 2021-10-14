import orFalse from '~/services/orFalse';
import Urls from '~/services/Urls';
import { Link } from 'react-router-dom';

import memcodeLogo from './halloween.png';

class Logo extends React.Component {
  static propTypes = {
    currentUser: orFalse(PropTypes.object).isRequired,
    ifMobile: PropTypes.bool,
  }

  getLink = () => {
    const currentUser = this.props.currentUser;
    const ifMobile = this.props.ifMobile;
    const ifDesktop = !ifMobile;

    // Signed-in
    if (currentUser && ifMobile) {
      return Urls.myCourses();
    } else if (currentUser && ifDesktop) {
      return Urls.courses();
    // Not signed-in
    } else {
      // This renders to the '/articles/welcome', but with a nice '/' link
      return '/';
    }
  }

  render = () =>
    <Link className="logo" to={this.getLink()}>
      <img className="halloween" alt="" src={memcodeLogo}/>
      MEMCODE
    </Link>
}

export default Logo;
