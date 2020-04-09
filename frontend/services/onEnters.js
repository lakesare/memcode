import store from '~/store';
import { Redirect } from 'react-router';

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
    //This sets the lastpage information from sesssionStorage to lastpage
    let pageHistory = sessionStorage.getItem("lastpage");
    sessionStorage.removeItem("lastpage");
    return (props) => <Redirect to={pageHistory ? pageHistory : "/courses/learning"} {...props}/>;
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
