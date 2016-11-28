import express from 'express';
const router = express.Router();

import passport from 'passport';

import passportGithub from 'passport-github2'; // github2 because github module is outdated
const GithubStrategy = passportGithub.Strategy;

const github = {
  clientID: '1d94a714bab1f1576872',
  clientSecret: 'cfd3be4dfba0dea31889e869e2eaf7dd3418ee5f',
  callbackURL: 'http://localhost:3000/auth/github/callback'
};

import * as User from '../users/model';
passport.use(
  new GithubStrategy(
    github,
    (accessToken, refreshToken, profile, done) => {
      // github doesn't give us refreshTokens, so we are not using it.
      // we may be storing access_token in case we need to access github's api, but we don't need it.
      // find_or_create
      User.getUserByOauth('github', profile.id).then((user) => {
        if (user === null) {
          User.createUserFromGithub(profile).then(() => {
            User.getUserByOauth('github', profile.id).then((user) =>  done(null, user))
          })
        } else {
          done(null, user);
        }
      })
    }
  )
);

// user: what's returned by done(null, user) in strategy
passport.serializeUser((user, done) => {
  console.log('serializeUser');
  done(null, { oauthProvider: user.oauthProvider, oauthId: user.oauthId });
});

passport.deserializeUser((user, done) => {
  console.log('deserializeUser');
  User.getUserByOauth(user.oauthProvider, user.oauthId).then((user) => {done(null, user)}).catch((error) => console.log(error))
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/courses');
});

// passport.authenticate() middleware invokes req.login() automatically.
// we will call this to start the GitHub Login process
router.get('/login', passport.authenticate('github'));

// GitHub will call this URL
router.get('/github/callback', 
  passport.authenticate('github', { 
    failureRedirect: '/',
    successRedirect: '/profile'
  })
);



export { router };