import 'source-map-support/register';
import express from 'express';

// load environment variables.
import '../env.js';

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

// routes
import { router as coursesRouter } from './components/courses/routes';
app.use('/api/courses', coursesRouter);

import { router as problemsRouter } from './components/problems/routes';
app.use('/api/problems', problemsRouter);

import { router as coursesUserIsLearningRouter } from './components/coursesUserIsLearning/routes';
app.use('/api/coursesUserIsLearning', coursesUserIsLearningRouter);

// GET routes that return results for particular frontend page. something like what server-rendering would do.
import { router as pagesRouter } from './components/pages/routes';
app.use('/api/pages', pagesRouter);

import { router as authRouter } from './components/auth/routes';
app.use('/api/auth', authRouter);

app.get('*', (request, response) =>
  response.send(
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Memcode</title>
      <link rel="stylesheet" href="/styles.css">
      <link href="/index.css" rel="stylesheet"></head>
    <body>
      <div id="root"></div>
      <script>
        window.env = {
          githubSignInLink: 'https://github.com/login/oauth/authorize?client_id=${process.env['GITHUB_OAUTH_ID']}'
        };
      </script>
      <script type="text/javascript" src="/index.js"></script>
    </html>
    `
  )
);

app.listen(port, (err) => {
  if (err) console.log('something bad happened', err);
  console.log(`server is listening on ${port}`);
});
