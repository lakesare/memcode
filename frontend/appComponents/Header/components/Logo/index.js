import orFalse from '~/services/orFalse';
import Urls from '~/services/Urls';
import { Link } from 'react-router-dom';
import getSeasonalTheme from '~/services/getSeasonalTheme';

import halloweenLogo from './halloweenLogo.png';
import christmasLogo from './christmasLogo.png';

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

  renderSeasonalDecoration = () => {
    const theme = getSeasonalTheme();
    if (theme === 'halloween') {
      return <img className="halloween" src={halloweenLogo} alt="Halloween pumpkin" aria-hidden="true"/>;
    } else if (theme === 'christmas') {
      return <img className="christmas-icon" src={christmasLogo} alt="Christmas mistletoe" aria-hidden="true"/>;
    }
    return null;
  }

  render = () =>
    <Link className="logo" to={this.getLink()}>
      {this.renderSeasonalDecoration()}
      MEMCODE
    </Link>
}

export default Logo;
