import 'source-map-support/register';
import express from 'express';
import { prettyError } from './middlewares/prettyError';

const app = express();
const port = 3000;

import { allowCrossDomain } from './middlewares/allowCrossDomain';
app.use(allowCrossDomain);

import { stopPropagationForAssets } from './middlewares/stopPropagationForAssets';
app.use(stopPropagationForAssets);

import bodyParser from 'body-parser';
app.use(bodyParser.json()); // to support JSON-encoded bodies

import { staticAssets } from './middlewares/static';
app.use(staticAssets);

import { ourSession } from './middlewares/ourSession';
app.use(ourSession);

import passport from 'passport';
app.use(passport.initialize());
app.use(passport.session());

// routes
import { router as coursesRouter } from './components/courses/routes';
app.use('/api/courses', coursesRouter);

import { router as problemsRouter } from './components/problems/routes';
app.use('/api/problems', problemsRouter);

import { router as authRouter } from './components/auth/routes';
app.use('/auth', authRouter);




app.use((req, res, next) => {
  // console.log(req.user)
  req.session.currentUser = req.user
  res.cookie('currentUser', JSON.stringify(req.user))
  next();
})

app.get('*', (req, res) => res.sendFile('/home/lakesare/Desktop/memcode/frontend/webpacked/index.html'));

app.listen(port, (err) => {
  if (err) { console.log('something bad happened', err) }
  console.log(`server is listening on ${port}`)
});
