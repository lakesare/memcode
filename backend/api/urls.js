import router from '~/router';

import catchAsync from '~/services/catchAsync';

import NotificationApi from '~/api/NotificationApi';
import CourseCategoryApi from '~/api/CourseCategoryApi';
import CourseUserIsLearningApi from '~/api/CourseUserIsLearningApi';
import ProblemUserIsLearningApi from '~/api/ProblemUserIsLearningApi';
import UserApi from '~/api/UserApi';
import ProblemApi from '~/api/ProblemApi';

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
import CourseApi from '~/api/CourseApi';
router.use('/api/courses', CourseApi);

import AuthApi from '~/api/AuthApi';
router.use('/api/auth', AuthApi);

import PageApi from '~/api/PageApi';
router.use('/api/pages', PageApi);

import FileApi from '~/api/FileApi';
router.use('/api/files', FileApi);
