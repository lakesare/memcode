import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router';

import Urls from '~/services/Urls';
import { AuthenticationActions } from '~/reducers/Authentication';
import isUserAdmin from '../../../services/isUserAdmin.js';

const useCurrentUser = () =>
  useSelector((state) => state.global.Authentication.currentUser || false);

const RequireAuth = ({ children }) => {
  const currentUser = useCurrentUser();

  if (currentUser) {
    return children;
  } else {
    return <Navigate to="/please-sign-in" replace/>;
  }
};

const RequireAdmin = ({ children }) => {
  const currentUser = useCurrentUser();

  if (isUserAdmin(currentUser)) {
    return children;
  } else {
    return <Navigate to="/please-sign-in" replace/>;
  }
};

const RedirectToOwnCoursesIfAuthenticated = ({ children }) => {
  const currentUser = useCurrentUser();
  // This sets the lastpage information from sesssionStorage to lastpage
  const [lastPage] = useState(() => {
    if (!currentUser) return null;
    const pageHistory = sessionStorage.getItem("lastpage");
    sessionStorage.removeItem("lastpage");
    return pageHistory;
  });

  if (currentUser) {
    return <Navigate to={lastPage ? lastPage : Urls.userShow(currentUser.id)} replace/>;
  } else {
    return children;
  }
};

const SignInFromUrlToken = ({ children }) => {
  const dispatch = useDispatch();
  const token = new URLSearchParams(window.location.search).get('token');

  useEffect(() => {
    if (!token) return;
    AuthenticationActions.signIn(dispatch, token);
    // Removes the ?token from the url, and allows react-router to refresh
    window.location.replace(window.location.pathname);
  }, [token, dispatch]);

  if (token) {
    return null;
  } else {
    return children;
  }
};

RequireAuth.propTypes = { children: PropTypes.node.isRequired };
RequireAdmin.propTypes = { children: PropTypes.node.isRequired };
RedirectToOwnCoursesIfAuthenticated.propTypes = { children: PropTypes.node.isRequired };
SignInFromUrlToken.propTypes = { children: PropTypes.node.isRequired };

export {
  RequireAuth, RequireAdmin,
  RedirectToOwnCoursesIfAuthenticated, SignInFromUrlToken
};
