import fetch from 'node-fetch';

// getting the profile details
const fetchProfile = (accessToken) => fetch('https://api.github.com/user', {
  headers: {
    Authorization: `token ${accessToken}`
  }
}).then((response) => {
  if (response.ok) {
    return response.json();
  } else {
    return response.json()
      .then((res) => Promise.reject(res));
  }
});

// fetching the user email in case if it is not available public as part of profile details
const fetchEmail = (accessToken) => fetch('https://api.github.com/user/emails', {
  headers: {
    Authorization: `token ${accessToken}`
  }
}).then((response) => {
  if (response.ok) {
    return response.json();
  } else {
    return response.json()
      .then((res) => Promise.reject(res));
  }
});

// fetching our profile info signed in as a user (access token)
const githubFetchAuthorizedAccount = (accessToken) =>
  Promise.all([fetchProfile(accessToken), fetchEmail(accessToken)])
    .then(([profile, emails]) => {
      const email = emails[0].email;
      profile.email = email;
      return profile;
    });

export { githubFetchAuthorizedAccount };
