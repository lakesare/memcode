import fetch from 'node-fetch';

// fetching our profile info signed in as a user (access token)
const githubFetchAuthorizedAccount = (accessToken) =>
  fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${accessToken}`
    }
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json()
          .then((res) => Promise.reject(res));
      }
    });

const githubUpdateEmailForAll = (accessToken) => 
  fetch('https://api.github.com/user/emails', {
    headers: { 
      Authorization: `token ${accessToken}`
    }
  }).then((response)=> {
    if (response.ok) {
      return response.json();
    } else {
      return response.json()
        .then((res) => Promise.reject(res));
    }
  });
export { githubFetchAuthorizedAccount,  githubUpdateEmailForAll};
