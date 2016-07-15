import React from 'react';

import { Link } from 'react-router'


class Header extends React.Component {
  render() {
    return(
      <nav className='row'>
        <Link to="/todos"    className='columns small-6'>Todos   </Link>
        <Link to="/problems" className='columns small-6'>Problems</Link>
      </nav>
    )
  }
};

export { Header };
