import express from 'express';
const router = express.Router();

import jwt from 'jsonwebtoken';
import FormData from 'form-data';
import fetch from 'node-fetch';

import * as User from '../users/model';

import { db } from '../../db/init.js';

const github = {
  clientId: '1d94a714bab1f1576872',
  clientSecret: 'cfd3be4dfba0dea31889e869e2eaf7dd3418ee5f',
  callbackURL: 'http://localhost:3000/auth/github/callback'
};

// 1. after user goes to github.com/login/oauth/authorize?client_id=OUR_ID, she is redirected here 
router.get('/github/callback', (req, res) => {
  // getting access token by sending github authorization code that will prove to github that it's indeed
  // we are the application (client_id, client_secret) that user gave access to
  let data = new FormData();
  data.append('client_id', github.clientId);
  data.append('client_secret', github.clientSecret);
  data.append('code', req.query.code);

  fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    body: data
  })
    .then(response => (response.ok ? response.text() : Promise.reject(response)))
    .then((response) => {
      // 'access_token=0bc4d5757978a90d8e9bc96fac795c876179f2ba&scope=&token_type=bearer'
      const accessToken = response.split('access_token=')[1].split('&scope')[0];

      // fetching our profile info signed in as a user (access token)
      return fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${accessToken}`
        }
      })
        .then(response => response.json())
        .then((accountReturnedFromGithub) => {
          // now that we are sure our user is this github's user, let's
          return db.oneOrNone("SELECT * FROM users WHERE oauth_provider=${oauth_provider} AND oauth_id=${oauth_id}", {
              oauth_provider: 'github',
              oauth_id: (accountReturnedFromGithub.id).toString()
            })
            .then((existingUser) => {
              if (existingUser) { // user with this github_id is already in our db! sign in.
                const token = jwt.sign(existingUser, 'serverereSecretty');
                console.log({ existingUser, token })
                redirectWithToken(res, token);
              } else { // no users with this id found! create such user and sign in.
                return db.one("INSERT INTO users(oauth_provider, oauth_id, username, avatar_url) VALUES(${oauth_provider}, ${oauth_id}, ${username}, ${avatar_url}) RETURNING *", {
                  oauth_provider: 'github',
                  oauth_id: (accountReturnedFromGithub.id).toString(),
                  username: accountReturnedFromGithub.login,
                  avatar_url: accountReturnedFromGithub.avatar_url
                })
                  .then((createdUser) => {
                    const token = jwt.sign(createdUser, 'serverereSecretty');
                    redirectWithToken(res, token);
                  })
              }
            })
        })
    })
    .catch(error => console.log(error.stack ? error.stack : error))
});

// let's put token into header, so that we don't have to display the query string and the delete it
// nope, because turns out we can't see headers on initial page load
const redirectWithToken = (res, token) =>
  res.redirect('/?token=' + token);









export { router };
