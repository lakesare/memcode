import router from '#~/router.js';
import catchAsync from '#~/services/catchAsync.js';

import TtsApi                   from '#~/api/TtsApi/index.js';
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

const apis = {
  TtsApi, UserApi, AuthApi, PageApi, AdminApi, CourseApi, ProblemApi,
  NotificationApi, CourseCategoryApi, CourseUserIsLearningApi,
  ProblemUserIsLearningApi
};

const callApiMethod = (ifGet) =>
  catchAsync(async (request, response, next) => {
    if (ifGet) { request.body = request.query; }

    const { controllerName, methodName } = request.params;
    const SomeApi = Object.hasOwn(apis, controllerName) ? apis[controllerName] : null;

    if (SomeApi && Object.hasOwn(SomeApi, methodName)) {
      await SomeApi[methodName](request, response, next);
    } else {
      response.error(`No such api method: ${controllerName}.${methodName}`);
    }
  });

router.post('/api/:controllerName.:methodName', callApiMethod(false));
router.get('/api/:controllerName.:methodName', callApiMethod(true));

// MUST STAY AS STANDARD URLS
// BECAUSE: oauth callbacks
router.use('/api/auth', AuthApi);
// BECAUSE: multipart file uploads with multer middleware
import FileApi from '#~/api/FileApi/index.js';
router.use('/api/files', FileApi);
