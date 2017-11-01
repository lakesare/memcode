import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

// getting access token by sending github authorization code that will prove to github that we are the application (client_id, client_secret) that user gave access to
const googleFetchAccessToken = async (oauthId, oauthSecret, code) => {
  const data = new URLSearchParams();
  data.append('client_id', oauthId);
  data.append('client_secret', oauthSecret);
  data.append('code', code);
  data.append('redirect_uri', process.env['GOOGLE_CALLBACK']);
  data.append('grant_type', 'authorization_code');

  const stringWithAccessToken = await
    fetch('https://www.googleapis.com/oauth2/v4/token', {
      method: 'POST',
      body: data
    })
      .then((response) => response.json());

  // {"error":"bad_verification_code","error_description":"The code passed is incorrect or expired.",
  if (stringWithAccessToken.error) {
    return Promise.reject(stringWithAccessToken.error_description);
  } else {
    const accessToken = stringWithAccessToken.access_token;
    return accessToken;
  }
};

export { googleFetchAccessToken };
