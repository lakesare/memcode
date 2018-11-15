import fetchWrapper from './services/fetchWrapper';
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
  const jwt = localStorage.getItem('jwt');
  return fetchWrapper(
    dispatch,
    fetch(url, {
      method,
      headers: new Headers({
        'Content-Type': 'application/json',
        ...(jwt ? { Authorization: `Bearer ${jwt}` } : {})
      }),
      body: JSON.stringify(body)
    })
  );
};

export { commonFetch };
export default commonFetch;
