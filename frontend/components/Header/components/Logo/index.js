import { Link } from 'react-router-dom';

import missle from './missle.svg';

// <img src={memcodeLogo}/>
class Logo extends React.Component {
  render = () =>
    <Link className="logo" to="/" style={{ position: 'relative' }}>
      MEMCODE

      <img
        style={{
          width: 44,
          position: 'absolute',
          opacity: 0.85,
          transform: 'rotate(10deg)',
          right: -42,
          top: 0
        }}
        src={missle}
      />
    </Link>
}

export default Logo;
