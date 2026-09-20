import jwtToUserObject from '~/services/jwtToUserObject';

const namespace = 'global.authentication';

const initialState = {
  currentUser: jwtToUserObject(localStorage.getItem('jwt')) || false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case `${namespace}.SET_CURRENT_USER`:
      return { currentUser: action.payload };
    default:
      return state;
  }
};

const getActions = (dispatch) => ({
  signIn: (token) => {
    localStorage.setItem('jwt', token);
    dispatch({ type: `${namespace}.SET_CURRENT_USER`, payload: jwtToUserObject(token) });
    // routers won't refresh with just the dispatch 😔
    // location.reload();
  },

  signOut: () => {
    localStorage.removeItem('jwt');
    // will issue a silly reflow
    // dispatch({ type: `${namespace}.SET_CURRENT_USER`, payload: null });
    location.reload();
  },

  updateCurrentUser: (user) => {
    dispatch({ type: `${namespace}.SET_CURRENT_USER`, payload: user });
  }
});

const selectors = {};

export default { reducer, getActions, selectors };
