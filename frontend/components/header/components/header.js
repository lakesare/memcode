import React from 'react';
import { Link } from 'react-router';
import css from './header.scss';


class Header extends React.Component {
  render() {
    return(
      <nav className={css.nav}>
        <div className="row">
          <Link to="/courses"     
                activeClassName={css.active} 
                className='columns small-6'>Courses</Link>
          <Link to="/courses/new" 
                activeClassName={css.active} 
                className='columns small-6'>Create new course!</Link>
        </div>
      </nav>
    )
  }
};

export { Header };