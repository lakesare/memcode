import speCreator from '~/services/speCreator.js';
import handleErrors from './handleErrors';

const fetchWrapper = (dispatch, fetchPromise) => {
  if (dispatch) dispatch(speCreator.request());
  return fetchPromise
    .then(handleErrors)
    .then((response) => {
      if (dispatch) dispatch(speCreator.success(response));
      return response;
    })
    .catch((error) => {
      // ___why should we keep this even though we see network responses anyway?
      //    because nonnetwork errors can get swallowed here just as well.
      console.log(error);
      if (dispatch) dispatch(speCreator.failure(error));
      return Promise.reject(error);
    });
};

export default fetchWrapper;
