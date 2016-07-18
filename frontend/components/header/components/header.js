import React from 'react';
import { Link } from 'react-router';
import css from './header.scss';


class Header extends React.Component {
  render() {
    return(
      <nav className='row'>
        <Link to="/courses" activeClassName={css.active} className='columns small-6'>Courses</Link>
        <Link to="/problems" className='columns small-6'>Problems</Link>
      </nav>
    )
  }
};

export { Header };
