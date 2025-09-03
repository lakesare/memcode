import router from '#~/router.js';

// only in NODE_ENV=PRODUCTION - this will redirect all http requests to https
import sslRedirect from 'heroku-ssl-redirect';
router.use(sslRedirect());

import allowCrossDomain from '#~/middlewares/allowCrossDomain.js';
router.use(allowCrossDomain);

import stopPropagationForAssets from '#~/middlewares/stopPropagationForAssets.js';
router.use(stopPropagationForAssets);

import bodyParser from '#~/middlewares/bodyParser.js';
router.use(bodyParser);

import webpackedFiles from '#~/middlewares/webpackedFiles.js';
router.use(webpackedFiles);

import optionalAuthenticate from '#~/middlewares/optionalAuthenticate.js';
router.use(optionalAuthenticate);

import injectResponseTypes from '#~/middlewares/injectResponseTypes.js';
router.use(injectResponseTypes);
