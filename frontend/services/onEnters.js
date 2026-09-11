import { Navigate } from 'react-router';
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
    return () => <Navigate to="/please-sign-in" replace/>;
  }
};

const redirectToOwnCoursesIfAuthenticated = (Component) => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    // This sets the lastpage information from sesssionStorage to lastpage
    const pageHistory = sessionStorage.getItem("lastpage");
    sessionStorage.removeItem("lastpage");
    return () => <Navigate to={pageHistory ? pageHistory : Urls.userShow(currentUser.id)} replace/>;
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
    return () => <Navigate to="/please-sign-in" replace/>;
  }
};

export default {
  requireAuthentication, redirectToOwnCoursesIfAuthenticated, requireAdmin, signIn
};
