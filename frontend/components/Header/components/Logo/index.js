import { Link } from 'react-router-dom';

// import memcodeLogo from './memcodeLogo.svg';

// <img src={memcodeLogo}/>
class Logo extends React.Component {
  render = () =>
    <Link className="logo" to="/courses">
      MEMCODE
    </Link>
}

export default Logo;
