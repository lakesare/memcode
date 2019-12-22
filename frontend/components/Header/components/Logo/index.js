import { Link } from 'react-router-dom';

// import missle from './missle.svg';

// <img src={memcodeLogo}/>
class Logo extends React.Component {
  render = () =>
    <Link className="logo" to="/">
      MEMCODE

      <img className="christmas-icon" src="https://images.vexels.com/media/users/3/133845/isolated/preview/d582812546109335e90d25dd6b5f26e6-red-santa-claus-hat-flat-icon-16-by-vexels.png"/>
    </Link>
}

export default Logo;
