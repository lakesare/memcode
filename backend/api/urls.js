import router from '#~/router.js';

import catchAsync from '#~/services/catchAsync.js';

import NotificationApi from '#~/api/NotificationApi/index.js';
import CourseCategoryApi from '#~/api/CourseCategoryApi/index.js';
import CourseUserIsLearningApi from '#~/api/CourseUserIsLearningApi/index.js';
import ProblemUserIsLearningApi from '#~/api/ProblemUserIsLearningApi/index.js';
import UserApi from '#~/api/UserApi/index.js';
import ProblemApi from '#~/api/ProblemApi/index.js';

const getApiClass = (controllerName) => {
  switch (controllerName) {
    case 'NotificationApi': return NotificationApi;
    case 'CourseCategoryApi': return CourseCategoryApi;
    case 'CourseApi': return CourseApi;
    case 'ProblemApi': return ProblemApi;
    case 'CourseUserIsLearningApi': return CourseUserIsLearningApi;
    case 'ProblemUserIsLearningApi': return ProblemUserIsLearningApi;
    case 'UserApi': return UserApi;
    case 'PageApi': return PageApi;
  }
};

// request.params - { controllerName: 'CourseApi', methodName: 'getPublicCourses' }
router.post('/api/:controllerName.:methodName', catchAsync(async (request, response, next) => {
  const SomeApi = getApiClass(request.params.controllerName);
  await SomeApi[request.params.methodName](request, response, next);
}));

router.get('/api/:controllerName.:methodName', catchAsync(async (request, response, next) => {
  // i want a uniform interface!
  request.body = request.query;
  const SomeApi = getApiClass(request.params.controllerName);
  await SomeApi[request.params.methodName](request, response, next);
}));

// TODO make all routes like NotificationApi.rate() instead.
// Everything that's below this line should be deleted eventually.
import CourseApi from '#~/api/CourseApi/index.js';
router.use('/api/courses', CourseApi);

import AuthApi from '#~/api/AuthApi/index.js';
router.use('/api/auth', AuthApi);

import PageApi from '#~/api/PageApi/index.js';
router.use('/api/pages', PageApi);

import FileApi from '#~/api/FileApi/index.js';
router.use('/api/files', FileApi);
