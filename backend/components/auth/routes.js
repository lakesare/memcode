import express from 'express';
const router = express.Router();

import jwt from 'jsonwebtoken';
import FormData from 'form-data';
import fetch from 'node-fetch';
import { catchAsync } from '~/services/catchAsync';

import * as User from '~/components/users/model';

// 1. after user goes to github.com/login/oauth/authorize?client_id=OUR_ID, she is redirected here
router.get('/github/callback', catchAsync(async (request, response) => {
  // getting access token by sending github authorization code that will prove to github that it's indeed
  // we are the application (client_id, client_secret) that user gave access to
  const data = new FormData();
  data.append('client_id', process.env['GITHUB_OAUTH_ID']);
  data.append('client_secret', process.env['GITHUB_OAUTH_SECRET']);
  data.append('code', request.query.code);

  // 'access_token=0bc4d5757978a90d8e9bc96fac795c876179f2ba&scope=&token_type=bearer'
  const stringWithAccessToken = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    body: data
  })
    .then(res => (res.ok ? res.text() : Promise.reject(res)));

  const accessToken = stringWithAccessToken.split('access_token=')[1].split('&scope')[0];

  // fetching our profile info signed in as a user (access token)
  const accountReturnedFromGithub = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${accessToken}`
    }
  }).then(res => res.json());

  // now that we are sure our user is this github's user, let's
  const existingUser = await User.select.oneByOauth('github', accountReturnedFromGithub.id);
  if (existingUser) { // user with this github_id is already in our db! sign in.
    const token = jwt.sign(existingUser, process.env['JWT_SECRET']);
    redirectWithToken(response, token);
  } else { // no users with this id found! create such user and sign in.
    const createdUser = await User.insert.createFromGithub(accountReturnedFromGithub);
    const token = jwt.sign(createdUser, process.env['JWT_SECRET']);
    redirectWithToken(response, token);
  }
}));

// let's put token into header, so that we don't have to display the query string and the delete it
// nope, because turns out we can't see headers on initial page load
const redirectWithToken = (response, token) =>
  response.redirect('/?token=' + token);

export { router };
