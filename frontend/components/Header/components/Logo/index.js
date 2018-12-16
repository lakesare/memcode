import { Link } from 'react-router';

import memcodeLogo from './memcodeLogo.svg';

class Logo extends React.Component {
  render = () =>
    <Link className="logo" to="/">
      <img src={memcodeLogo}/>
    </Link>
}

export default Logo;
