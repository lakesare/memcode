import orFalse from '~/services/orFalse';
import Urls from '~/services/Urls';
import { Link } from 'react-router-dom';

// import memcodeLogo from './halloween.png';

class Logo extends React.Component {
  static propTypes = {
    currentUser: orFalse(PropTypes.object).isRequired
  }

  getLink = () => {
    const currentUser = this.props.currentUser;

    // Signed-in
    if (currentUser) {
      return Urls.courses();
    // Not signed-in
    } else {
      // This renders to the '/articles/welcome', but with a nice '/' link
      return '/';
    }
  }

  render = () =>
    <Link className="logo" to={this.getLink()}>
      MEMCODE
    </Link>
}

export default Logo;
