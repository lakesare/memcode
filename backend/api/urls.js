import router from '#~/router.js';
import catchAsync from '#~/services/catchAsync.js';

import UserApi                  from '#~/api/UserApi/index.js';
import AuthApi                  from '#~/api/AuthApi/index.js';
import PageApi                  from '#~/api/PageApi/index.js';
import AdminApi                 from '#~/api/AdminApi/index.js';
import CourseApi                from '#~/api/CourseApi/index.js';
import ProblemApi               from '#~/api/ProblemApi/index.js';
import NotificationApi          from '#~/api/NotificationApi/index.js';
import CourseCategoryApi        from '#~/api/CourseCategoryApi/index.js';
import CourseUserIsLearningApi  from '#~/api/CourseUserIsLearningApi/index.js';
import ProblemUserIsLearningApi from '#~/api/ProblemUserIsLearningApi/index.js';

const getApiClass = (controllerName) => {
  switch (controllerName) {
    case 'UserApi':                  return UserApi;
    case 'AuthApi':                  return AuthApi;
    case 'PageApi':                  return PageApi;
    case 'AdminApi':                 return AdminApi;
    case 'CourseApi':                return CourseApi;
    case 'ProblemApi':               return ProblemApi;
    case 'NotificationApi':          return NotificationApi;
    case 'CourseCategoryApi':        return CourseCategoryApi;
    case 'CourseUserIsLearningApi':  return CourseUserIsLearningApi;
    case 'ProblemUserIsLearningApi': return ProblemUserIsLearningApi;
  }
};

router.post('/api/:controllerName.:methodName', catchAsync(async (request, response, next) => {
  const SomeApi = getApiClass(request.params.controllerName);
  await SomeApi[request.params.methodName](request, response, next);
}));

router.get('/api/:controllerName.:methodName', catchAsync(async (request, response, next) => {
  request.body = request.query;
  const SomeApi = getApiClass(request.params.controllerName);
  await SomeApi[request.params.methodName](request, response, next);
}));

// MUST STAY AS STANDARD URLS
// BECAUSE: oauth callbacks
router.use('/api/auth', AuthApi);
// BECAUSE: multipart file uploads with multer middleware
import FileApi from '#~/api/FileApi/index.js';
router.use('/api/files', FileApi);
