import { Link } from 'react-router';

import memcodeLogo from './memcodeLogo.svg';

class Logo extends React.Component {
  render = () =>
    <section className="logo">
      <Link to="/">
        <img src={memcodeLogo}/>
      </Link>
      {/* <div className="memorizing-is-hard-caption">
        Retain the understanding.
      </div> */}
    </section>
}

export default Logo;
