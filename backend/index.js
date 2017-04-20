import 'source-map-support/register';
import express from 'express';

// load environment variables.
import '../env.js';
console.log('node env: ' + process.env.NODE_ENV);

const app = express();


import { allowCrossDomain } from './middlewares/allowCrossDomain';
app.use(allowCrossDomain);

import { stopPropagationForAssets } from './middlewares/stopPropagationForAssets';
app.use(stopPropagationForAssets);

import bodyParser from 'body-parser';
app.use(bodyParser.json({ limit: '50mb' })); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
  limit: '50mb', // otherwise will complain about images
  extended: true,
  parameterLimit: 50000
}));

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
      <link href="/index.css" rel="stylesheet">
      <!-- to verify google webmasters -->
      <meta name="google-site-verification" content="Cv256pnTnFWM0T6qi3SXK1u1K-B6W7IJQ9JoOQ_1I_E"/>

      <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32"/>
      <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16"/>

      <meta name="description" content="Create your own course to memorize anything you want. Flashcard-based, with formatting and images, with multiple flashcard types."/>
    </head>
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



// because express needs to see there are 4 arguments to treat :error as error.
// this middleware should also come last.
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(500).json({ error: error.message });
});

// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 3000;

app.listen(port, (err) => {
  err ?
  console.log(`server start error: ${err}`) :
  console.log(`server is listening on port: ${port}`);
});
