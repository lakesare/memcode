import express from 'express';
const router = express.Router();

import jwt from 'jsonwebtoken';
import { catchAsync } from '~/services/catchAsync';
import { githubFetchAccessToken } from './services/github/githubFetchAccessToken';
import { githubFetchAuthorizedAccount } from './services/github/githubFetchAuthorizedAccount';

import { googleFetchAccessToken } from './services/google/googleFetchAccessToken';
import { googleFetchAuthorizedAccount } from './services/google/googleFetchAuthorizedAccount';

import * as User from '~/components/users/model';

const createOauthProvider = (oauthProviderName) => {
  switch (oauthProviderName) {
    case 'github':
      return {
        fetchAccessToken: githubFetchAccessToken,
        fetchProfile: githubFetchAuthorizedAccount,
        oauthId: process.env['GITHUB_OAUTH_ID'],
        oauthSecret: process.env['GITHUB_OAUTH_SECRET']
      };
    case 'google':
      return {
        fetchAccessToken: googleFetchAccessToken,
        fetchProfile: googleFetchAuthorizedAccount,
        oauthId: process.env['GOOGLE_OAUTH_ID'],
        oauthSecret: process.env['GOOGLE_OAUTH_SECRET']
      };
  }
};

const createOauthCallbackRoute = async (oauthProviderName, code, response) => {
  const oauthProvider = createOauthProvider(oauthProviderName);
  const accessToken = await oauthProvider.fetchAccessToken(oauthProvider.oauthId, oauthProvider.oauthSecret, code);
  const oauthProfile = await oauthProvider.fetchProfile(accessToken);
  const dbUser =
    await User.select.oneByOauth(oauthProviderName, oauthProfile.id) ||
    await User.insert.createFrom(oauthProviderName, oauthProfile);
  const token = jwt.sign(dbUser, process.env['JWT_SECRET']);
  response.redirect('/?token=' + token);
};

// after user goes to github.com/login/oauth/authorize?client_id=OUR_ID, she is redirected here
// docs: https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/about-authorization-options-for-oauth-apps
router.get('/github/callback', catchAsync(async (request, response) => {
  createOauthCallbackRoute('github', request.query.code, response);
}));

router.get('/google/callback', catchAsync(async (request, response) => {
  createOauthCallbackRoute('google', request.query.code, response);
}));

export { router };
