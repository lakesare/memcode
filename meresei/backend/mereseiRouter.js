import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
import html from './html.js';
import nocache from '#~/middlewares/nocache.js';
mereseiRouter.get('*', nocache(), (request, response) => response.send(html));

import handleErrors from '#~/middlewares/handleErrors.js';
mereseiRouter.use(handleErrors);

export default mereseiRouter;
