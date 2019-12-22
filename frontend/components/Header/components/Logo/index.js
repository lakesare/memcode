import { Link } from 'react-router-dom';

import missle from './missle.svg';

// <img src={memcodeLogo}/>
class Logo extends React.Component {
  render = () =>
    <Link className="logo" to="/" style={{ position: 'relative' }}>
      MEMCODE

      <img
        style={{
          width: 62,
          position: 'absolute',
          opacity: 0.85,
          transform: 'rotate(20deg)',
          left: '-60px',
          top: '-4px'
        }}
        src={missle}
      />
    </Link>
}

export default Logo;
