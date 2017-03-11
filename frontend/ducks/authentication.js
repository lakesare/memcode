import Immutable from 'immutable';

import { getCurrentUserFromLocalStorage } from '../services/getCurrentUserFromLocalStorage';

const initialState = {
  currentUser: getCurrentUserFromLocalStorage()
};

const authenticationReducer = (authentication = initialState, action) => {
  authentication = Immutable.fromJS(authentication);
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return authentication
        .setIn(['currentUser'], action.payload)
        .toJS();
    default:
      return authentication.toJS();
  }
};

// async action creators

// after we update localStorage we need to call this action
const renewCurrentUserFromStorage = (dispatch) => {
  dispatch({ type: 'SET_CURRENT_USER', payload: getCurrentUserFromLocalStorage() });
};


export {
  authenticationReducer,
  renewCurrentUserFromStorage
};
