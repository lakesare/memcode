import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import knex from '#~/db/knex.js';

import catchAsync from '#~/services/catchAsync.js';
import { githubFetchAccessToken } from './services/github/githubFetchAccessToken.js';
import { githubFetchAuthorizedAccount } from './services/github/githubFetchAuthorizedAccount.js';
import { googleFetchAccessToken } from './services/google/googleFetchAccessToken.js';
import { googleFetchAuthorizedAccount } from './services/google/googleFetchAuthorizedAccount.js';
import NotificationModel from '#~/models/NotificationModel/index.js'
import UserModel from '#~/models/UserModel/index.js'

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
    const welcomeCourseId = 6868;
    await knex('courseUserIsLearning').insert({ courseId: welcomeCourseId, userId: dbUser.id, active: true });
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

// Local authentication signup
router.post('/signup', catchAsync(async (request, response) => {
  const { username, email, password } = request.body;

  // Collect all validation errors
  const errors = [];

  // Validate input
  if (!username) {
    errors.push('Username is required');
  } else if (username.length < 2) {
    errors.push('Username must be at least 2 characters');
  }

  if (!email) {
    errors.push('Email is required');
  }

  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  // Check if username already exists (only if username is valid)
  if (username && username.length >= 2) {
    const existingUserByUsername = await knex('user')
      .where({ username })
      .whereNull('oauthProvider')
      .first();
    if (existingUserByUsername) {
      errors.push('Username already taken');
    }
  }

  // Check if email already exists (only if email is provided)
  if (email) {
    const existingUserByEmail = await knex('user')
      .where({ email })
      .whereNull('oauthProvider')
      .first();
    if (existingUserByEmail) {
      errors.push('Email already registered');
    }
  }

  // Return all errors if any exist
  if (errors.length > 0) {
    return response.validation(errors);
  }

  // Hash password and create user
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  
  const [dbUser] = await knex('user')
    .insert({
      username,
      email,
      passwordHash
    })
    .returning('*');

  // Send welcome notification and add welcome course
  await NotificationModel.insert.welcome_to_memcode({ userId: dbUser.id });
  const welcomeCourseId = 6868;
  await knex('courseUserIsLearning').insert({ courseId: welcomeCourseId, userId: dbUser.id, active: true });

  // Generate JWT token
  const token = jwt.sign(dbUser, process.env['JWT_SECRET']);
  
  response.success({ token, user: dbUser });
}));

// Local authentication login
router.post('/login', catchAsync(async (request, response) => {
  const { username, password } = request.body;

  // Validate input
  if (!username || !password) {
    return response.validation(['Username and password are required']);
  }

  // Find user
  const dbUser = await knex('user')
    .where({ username })
    .whereNull('oauthProvider')
    .first();
  if (!dbUser) {
    return response.validation(['Invalid username or password']);
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, dbUser.passwordHash);
  if (!isValidPassword) {
    return response.validation(['Invalid username or password']);
  }

  // Generate JWT token
  const token = jwt.sign(dbUser, process.env['JWT_SECRET']);
  
  response.success({ token, user: dbUser });
}));

export default router;
