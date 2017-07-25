import * as spe from '~/services/spe.js';
import { handleErrors } from './handleErrors';
// ___how to use it?
//
// _in api/UserApi.js:
// const create = (dispatch, values) =>
//   commonFetch(dispatch,
//     'POST', '/api/users',
//     { userDTO: values }
//   );
//
// _and then in our component:
// UserApi.create(
//   (spe) => this.setState({ speCreateUser: spe }), // so that our UserApi knows how to update out component's state
//   'GET', '/api/users',
//   { username: 'Mary' }
// )
//
// it explicitly returns a promise, so that we can do something on success/failure:
// UserApi.create()
//   .then((createdUser) => console.log(createdUser))
//   .catch((error) => this.setState({ error }))
//
// if it's a GET request - just omit the body argument.
const commonFetch = (dispatch, method, url, body = undefined) => {
  dispatch(spe.request());
  return fetch(url, {
    method,
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('jwt')
    }),
    body: JSON.stringify(body)
  })
    .then(handleErrors)
    .then((response) => {
      dispatch(spe.success(response));
      return Promise.resolve(response);
    })
    .catch((error) => { // { error: error }
      console.log(error);
      dispatch(spe.failure(error.error));
      return Promise.reject(error);
    });
};

export { commonFetch };
