import { Redirect } from 'react-router';
import store from '~/store';
import Urls from '~/services/Urls';
import { AuthenticationActions } from '~/reducers/Authentication';
import isUserAdmin from '../../services/isUserAdmin.js';

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
  const currentUser = getCurrentUser();
  if (currentUser) {
    // This sets the lastpage information from sesssionStorage to lastpage
    const pageHistory = sessionStorage.getItem("lastpage");
    sessionStorage.removeItem("lastpage");
    return (props) => <Redirect to={pageHistory ? pageHistory : Urls.userShow(currentUser.id)} {...props}/>;
  } else {
    return (props) => <Component {...props}/>;
  }
};

const signIn = (Component) => {
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get('token');
  if (token) {
    AuthenticationActions.signIn(store.dispatch, token);
    // Removes the ?token from the url, and allows react-router to refresh
    window.location = window.location.pathname;
    return null;
  } else {
    return (props) => <Component {...props}/>;
  }
};

const requireAdmin = (Component) => {
  const currentUser = getCurrentUser();
  if (currentUser && isUserAdmin(currentUser)) {
    return (props) => <Component {...props}/>;
  } else {
    return (props) => <Redirect to="/please-sign-in" {...props}/>;
  }
};

export default {
  requireAuthentication, redirectToOwnCoursesIfAuthenticated, requireAdmin, signIn
};
