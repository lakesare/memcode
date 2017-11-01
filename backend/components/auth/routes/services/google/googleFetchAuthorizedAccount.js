import fetch from 'node-fetch';

// fetching our profile info signed in as a user (access token)
const googleFetchAuthorizedAccount = (accessToken) =>
  fetch('https://www.googleapis.com/userinfo/v2/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      return response.json()
        .then((res) => Promise.reject(res));
    }
  }).catch((err) => console.log(err));

export { googleFetchAuthorizedAccount };
