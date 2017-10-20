import express from 'express';
const router = express.Router();

import jwt from 'jsonwebtoken';
import { catchAsync } from '~/services/catchAsync';
import { githubFetchAccessToken } from './services/githubFetchAccessToken';
import { githubFetchAuthorizedAccount } from './services/githubFetchAuthorizedAccount';

import * as User from '~/components/users/model';

// after user goes to github.com/login/oauth/authorize?client_id=OUR_ID, she is redirected here
// docs: https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/about-authorization-options-for-oauth-apps
router.get('/github/callback', catchAsync(async (request, response) => {
  const accessToken = await githubFetchAccessToken(process.env['GITHUB_OAUTH_ID'], process.env['GITHUB_OAUTH_SECRET'], request.query.code);

  const accountFromGithub = await githubFetchAuthorizedAccount(accessToken);

  let user = await User.select.oneByOauth('github', accountFromGithub.id);
  if (!user) {
    user = await User.insert.createFromGithub(accountFromGithub);
  }

  const token = jwt.sign(user, process.env['JWT_SECRET']);
  response.redirect('/?token=' + token);
}));

export { router };
