import store from '~/store';
import { Redirect } from 'react-router';
import currentwindow from '~/components/SigninLink';
/* I am trying to import the function from the SignInLinks.js for pathname*/

const getCurrentUser = () =>
  store.getState().global.Authentication.currentUser;

const requireAuthentication = (Component) => {
  if (getCurrentUser()) {
    return (props) => <Component {...props}/>;
  } else {
    return (props) => <Redirect to="/please-sign-in" {...props}/>;
  }
};

const redirectToOwnCoursesIfAuthenticated = (Component) => {
  if (getCurrentUser()) {
/*Here i would like to redirect back to the pathname which i have collected in the SignInLinnks.js*/
    return (props) => <Redirect to={currentwindow.redirect_back_to} {...props}/>;
  } else {
    return (props) => <Component {...props}/>;
  }
};

const requireAdmin = (Component) => {
  // introduce ifAdmin=true later
  if (getCurrentUser() && getCurrentUser().email === 'lakesare@gmail.com') {
    return (props) => <Component {...props}/>;
  } else {
    return (props) => <Redirect to="/please-sign-in" {...props}/>;
  }
};

export default {
  requireAuthentication, redirectToOwnCoursesIfAuthenticated, requireAdmin
};
