import React from 'react';
import { Link } from 'react-router';
import css from './header.scss';

let Header = React.createClass({
  render() {
    return(
      <nav className={css.nav}>
        <div className="row">
          <Link to="/courses"
                activeClassName={css.active}
                className='columns small-3'>Courses</Link>
          <Link to="/courses/new"
                activeClassName={css.active}
                className='columns small-3'>Create new course!</Link>

          <a href="/auth/login"
             className='columns small-3'>log in</a>
          <a href='/auth/logout'
             className='columns small-3'>logout</a>

          {//JSON.stringify(req.user, null, 4)}
        }
        </div>
      </nav>
    )
  }
});



import { connect } from 'react-redux';
// import { signInCreator } from '../../../components/auth/actions';


const mapStateToProps = (state) => {
  return {
    // problems: state.problems,
    // course:   state.courses.course
    auth: ''
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // signIn: signInCreator(dispatch)
  }
}

Header = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);

export { Header };
