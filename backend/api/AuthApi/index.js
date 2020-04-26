import express from 'express';
import jwt from 'jsonwebtoken';

import catchAsync from '~/services/catchAsync';
import { githubFetchAccessToken } from './services/github/githubFetchAccessToken';
import { githubFetchAuthorizedAccount } from './services/github/githubFetchAuthorizedAccount';
import { googleFetchAccessToken } from './services/google/googleFetchAccessToken';
import { googleFetchAuthorizedAccount } from './services/google/googleFetchAuthorizedAccount';
import NotificationModel from '~/models/NotificationModel';
import UserModel from '~/models/UserModel';

const router = express.Router();

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

// @param referrerUrl - e.g. http://memcode.com/please-sign-in
const createOauthCallbackRoute = async (oauthProviderName, code, response) => {
  const oauthProvider = createOauthProvider(oauthProviderName);
  const accessToken = await oauthProvider.fetchAccessToken(oauthProvider.oauthId, oauthProvider.oauthSecret, code);
  const oauthProfile = await oauthProvider.fetchProfile(accessToken);

  let dbUser = await UserModel.select.oneByOauth(oauthProviderName, oauthProfile.id);
  if (!dbUser) {
    dbUser = await UserModel.insert.createFrom(oauthProviderName, oauthProfile);
    await NotificationModel.insert.welcome_to_memcode({ userId: dbUser.id });
    // await sendWelcomeEmail(oauthProfile.email);
  }

  const token = jwt.sign(dbUser, process.env['JWT_SECRET']);

  const redirectUrl = `/?token=${encodeURIComponent(token)}`;
  response.redirect(redirectUrl);
};

// after user goes to github.com/login/oauth/authorize?client_id=OUR_ID, she is redirected here
// docs: https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/about-authorization-options-for-oauth-apps
router.get('/github/callback', catchAsync(async (request, response) => {
  await createOauthCallbackRoute('github', request.query.code, response);
}));

router.get('/google/callback', catchAsync(async (request, response) => {
  await createOauthCallbackRoute('google', request.query.code, response);
}));

export default router;
