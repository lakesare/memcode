import jwtToUserObject from '~/services/jwtToUserObject';

const initialState = {
  currentUser: jwtToUserObject(localStorage.getItem('jwt')) || false
};

const AuthenticationReducer = (authentication = initialState, action) => {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { currentUser: action.payload };
    default:
      return authentication;
  }
};

const AuthenticationActions = {
  // non-api action creators
  signIn: (dispatch, token) => {
    localStorage.setItem('jwt', token);
    dispatch({ type: 'SET_CURRENT_USER', payload: jwtToUserObject(token) });
    // routers won't refresh with just the dispatch 😔
    // location.reload();
  },

  signOut: () => {
    localStorage.removeItem('jwt');
    // will issue a silly reflow
    // dispatch({ type: 'SET_CURRENT_USER', payload: null });
    location.reload();
  },

  updateCurrentUser: (dispatch, user) => {
    dispatch({ type: 'SET_CURRENT_USER', payload: user });
  }
};

export {
  AuthenticationReducer,
  AuthenticationActions
};
