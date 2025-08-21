import express from 'express';
import path from 'path';
const mereseiRouter = express.Router();

// BEFORE middleware
// import stopPropagationForAssets from '~/middlewares/stopPropagationForAssets';
// router.use(stopPropagationForAssets);

import sslRedirect from 'heroku-ssl-redirect';
mereseiRouter.use(sslRedirect());

const webpackedFiles = express.static(path.join(__dirname, '../../meresei/frontend/dist'));
mereseiRouter.use(webpackedFiles);

const nonWebpackedFiles = express.static(path.join(__dirname, '../../meresei/frontend/nonWebpackedFiles'));
mereseiRouter.use(nonWebpackedFiles);

// AFTER middleware
import html from './html';
import nocache from '~/middlewares/nocache';
mereseiRouter.get('*', nocache(), (request, response) => response.send(html));

import handleErrors from '~/middlewares/handleErrors';
mereseiRouter.use(handleErrors);

export default mereseiRouter;
