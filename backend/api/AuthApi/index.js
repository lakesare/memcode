import express from 'express';
import jwt from 'jsonwebtoken';
import knex from '#~/db/knex.js';

import catchAsync from '#~/services/catchAsync.js';
import { githubFetchAccessToken } from './services/github/githubFetchAccessToken.js';
import { githubFetchAuthorizedAccount } from './services/github/githubFetchAuthorizedAccount.js';
import { googleFetchAccessToken } from './services/google/googleFetchAccessToken.js';
import { googleFetchAuthorizedAccount } from './services/google/googleFetchAuthorizedAccount.js';
import NotificationModel from '#~/models/NotificationModel.js'

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

  let dbUser = await knex('user')
    .where('oauth_provider', oauthProviderName)
    .where('oauth_id', oauthProfile.id.toString())
    .first();
  if (!dbUser) {
    // Create user from OAuth profile
    let userData;
    switch (oauthProviderName) {
      case 'github':
        userData = {
          oauthProvider: 'github',
          oauthId      : oauthProfile.id.toString(),
          username     : oauthProfile.login,
          avatarUrl    : oauthProfile.avatar_url,
          email        : oauthProfile.email,
          createdAt    : new Date()
        };
        break;
      case 'google':
        userData = {
          oauthProvider: 'google',
          oauthId      : oauthProfile.id.toString(),
          username     : oauthProfile.name,
          avatarUrl    : oauthProfile.picture,
          email        : oauthProfile.email,
          createdAt    : new Date()
        };
        break;
      default:
        throw new Error(`No such oauthProvider as '${oauthProviderName}'.`);
    }
    
    [dbUser] = await knex('user').insert(userData).returning('*');
    await NotificationModel.welcome_to_memcode({ userId: dbUser.id });
    // Only assign welcome course in production
    if (process.env.NODE_ENV === 'production') {
      const welcomeCourseId = 6868;
      await knex('courseUserIsLearning').insert({ courseId: welcomeCourseId, userId: dbUser.id, active: true });
    }
    // await sendWelcomeEmail(oauthProfile.email);
  }

  const token = jwt.sign(dbUser, process.env['JWT_SECRET']);

  const userUrl = `/users/${dbUser.id}?token=${encodeURIComponent(token)}`;
  response.redirect(userUrl);
};

// after user goes to github.com/login/oauth/authorize?client_id=OUR_ID, she is redirected here
// docs: https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/about-authorization-options-for-oauth-apps
router.get('/github/callback', catchAsync(async (request, response) => {
  await createOauthCallbackRoute('github', request.query.code, response);
}));

router.get('/google/callback', catchAsync(async (request, response) => {
  await createOauthCallbackRoute('google', request.query.code, response);
}));

// Add dynamic API methods to the router object
import signup from './signup.js';
router.signup = signup;
import login from './login.js';
router.login = login;

export default router;
