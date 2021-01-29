import { Link } from 'react-router-dom';

// import missle from './missle.svg';

// <img src={memcodeLogo}/>
class Logo extends React.Component {
  render = () =>
    <Link className="logo" to={window.innerWidth >= 930 ? '/courses' : '/courses/learning'}>
      MEMCODE
    </Link>
}

export default Logo;
