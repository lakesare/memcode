import express from 'express';
const routes = express();

// only in NODE_ENV=PRODUCTION - this will redirect all http requests to https
import sslRedirect from 'heroku-ssl-redirect';
routes.use(sslRedirect());

import { allowCrossDomain } from './middlewares/allowCrossDomain';
routes.use(allowCrossDomain);

import { stopPropagationForAssets } from './middlewares/stopPropagationForAssets';
routes.use(stopPropagationForAssets);

import bodyParser from 'body-parser';
routes.use(bodyParser.json({ limit: '50mb' })); // to support JSON-encoded bodies
routes.use(bodyParser.urlencoded({
  limit: '50mb', // otherwise will complain about image upload
  extended: true,
  parameterLimit: 50000
}));

import path from 'path';
routes.use(express.static(path.join(__dirname, '../../frontend/staticFiles/underRoot')));
routes.use('/static-files', express.static(path.join(__dirname, '../../frontend/staticFiles/underUrlPrefix')));
routes.use('/webpacked-files', express.static(path.join(__dirname, '../../frontend/webpackedFiles')));

// routes
import { router as coursesRouter } from './components/courses/routes';
routes.use('/api/courses', coursesRouter);

import { router as problemsRouter } from './components/problems/routes';
routes.use('/api/problems', problemsRouter);

import { router as coursesUserIsLearningRouter } from './components/coursesUserIsLearning/routes';
routes.use('/api/coursesUserIsLearning', coursesUserIsLearningRouter);

import { router as problemsUserIsLearningRouter } from './components/problemsUserIsLearning/routes';
routes.use('/api/problemsUserIsLearning', problemsUserIsLearningRouter);

import courseCategoryRouter from './components/courseCategories/routes';
routes.use('/api/courseCategories', courseCategoryRouter);

import notificationRouter from './components/notifications/routes';
routes.use('/api/notifications', notificationRouter);

import { router as authRouter } from './components/auth/routes';
routes.use('/api/auth', authRouter);

// GET routes that return results for particular frontend page. something like what a standard server-rendered structure would do.
import { router as pagesRouter } from './components/pages/routes';
routes.use('/api/pages', pagesRouter);

import adminRouter from './components/admin/routes';
routes.use('/api/admin', adminRouter);

import { html } from './html';
routes.get('*', (request, response) => response.send(html));

import { handleErrors } from './middlewares/handleErrors';
routes.use(handleErrors);

export { routes };
