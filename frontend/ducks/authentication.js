import { jwtToUserObject } from '~/services/jwtToUserObject';

const initialState = {
  currentUser: jwtToUserObject(localStorage.getItem('jwt'))
};

const authenticationReducer = (authentication = initialState, action) => {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { currentUser: action.payload };
    default:
      return authentication;
  }
};

// non-api action creators
const signIn = (dispatch, token) => {
  localStorage.setItem('jwt', token);
  dispatch({ type: 'SET_CURRENT_USER', payload: jwtToUserObject(token) });
};

const signOut = (dispatch) => {
  localStorage.removeItem('jwt');
  dispatch({ type: 'SET_CURRENT_USER', payload: null });
  // temporary hack
  location.reload();
};

export {
  authenticationReducer,
  signIn, signOut
};
