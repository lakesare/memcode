import router from '~/router';

// only in NODE_ENV=PRODUCTION - this will redirect all http requests to https
import sslRedirect from 'heroku-ssl-redirect';
router.use(sslRedirect());

import allowCrossDomain from '~/middlewares/allowCrossDomain';
router.use(allowCrossDomain);

import stopPropagationForAssets from '~/middlewares/stopPropagationForAssets';
router.use(stopPropagationForAssets);

import bodyParser from '~/middlewares/bodyParser';
router.use(bodyParser);

import webpackedFiles from '~/middlewares/webpackedFiles';
router.use(webpackedFiles);

import optionalAuthenticate from '~/middlewares/optionalAuthenticate';
router.use(optionalAuthenticate);

import injectResponseTypes from '~/middlewares/injectResponseTypes';
router.use(injectResponseTypes);
