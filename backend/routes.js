import express from 'express';
const routes = express();

// only in NODE_ENV=PRODUCTION - this will redirect all http requests to https
import sslRedirect from 'heroku-ssl-redirect';
routes.use(sslRedirect());

import allowCrossDomain from '~/middlewares/allowCrossDomain';
routes.use(allowCrossDomain);

import stopPropagationForAssets from '~/middlewares/stopPropagationForAssets';
routes.use(stopPropagationForAssets);

// import bodyParser from '~/middlewares/bodyParser';
// routes.use('/', bodyParser);

import bodyParser from 'body-parser';
routes.use(bodyParser.json({ limit: '50mb' })); // to support JSON-encoded bodies
routes.use(bodyParser.urlencoded({
  limit: '50mb', // otherwise will complain about image upload
  extended: true,
  parameterLimit: 50000
}));

import path from 'path';
routes.use('/', express.static(path.join(__dirname, '../../frontend/webpackedFiles')));

// routes
import CourseApi from '~/api/CourseApi';
routes.use('/api/courses', CourseApi);

import ProblemApi from '~/api/ProblemApi';
routes.use('/api/problems', ProblemApi);

import ProblemUserIsLearningApi from '~/api/ProblemUserIsLearningApi';
routes.use('/api/problemsUserIsLearning', ProblemUserIsLearningApi);

import CourseCategoryApi from '~/api/CourseCategoryApi';
routes.use('/api/courseCategories', CourseCategoryApi);

import NotificationApi from '~/api/NotificationApi';
routes.use('/api/notifications', NotificationApi);

import CourseUserIsLearningApi from '~/api/CourseUserIsLearningApi';
routes.use('/api/courseUserIsLearning', CourseUserIsLearningApi);

import AuthApi from '~/api/AuthApi';
routes.use('/api/auth', AuthApi);

import PageApi from '~/api/PageApi';
routes.use('/api/pages', PageApi);

import AdminApi from '~/api/AdminApi';
routes.use('/api/admin', AdminApi);

import FileApi from '~/api/FileApi';
routes.use('/api/files', FileApi);

import html from '~/html';
routes.get('*', (request, response) => response.send(html));

import handleErrors from '~/middlewares/handleErrors';
routes.use(handleErrors);

export default routes;
