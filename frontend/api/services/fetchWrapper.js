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
      // [claude comment] a TypeError means the request never reached the server - <Loading/> renders spe.error as text, and an Error object would crash it
      if (dispatch) dispatch(speCreator.failure(error instanceof TypeError ? "Can't reach Memcode - you seem to be offline." : error));
      return Promise.reject(error);
    });
};

export default fetchWrapper;
