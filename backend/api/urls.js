import router from '~/router';

import authenticate from '~/middlewares/authenticate';
import catchAsync from '~/services/catchAsync';


// TODO make all routes like CourseApi.rate()
import CourseApi from '~/api/CourseApi';
router.use('/api/courses', CourseApi);

import NotificationApi from '~/api/NotificationApi';


const getApiClass = (controllerName) => {
  switch (controllerName) {
    case 'NotificationApi': return NotificationApi;
    case 'CourseApi': return CourseApi;
  }
};

// request.params - { controllerName: 'CourseApi', methodName: 'getPublicCourses' }
router.post('/api/:controllerName.:methodName', catchAsync(async (request, response, next) => {
  const SomeApi = getApiClass(request.params.controllerName);
  await SomeApi[request.params.methodName](request, response, next);
}));






import ProblemApi from '~/api/ProblemApi';
router.use('/api/problems', ProblemApi);

import ProblemUserIsLearningApi from '~/api/ProblemUserIsLearningApi';
router.use('/api/problemsUserIsLearning', ProblemUserIsLearningApi);

import CourseCategoryApi from '~/api/CourseCategoryApi';
router.use('/api/courseCategories', CourseCategoryApi);


import CourseUserIsLearningApi from '~/api/CourseUserIsLearningApi';
router.use('/api/coursesUserIsLearning', CourseUserIsLearningApi);

import AuthApi from '~/api/AuthApi';
router.use('/api/auth', AuthApi);

import PageApi from '~/api/PageApi';
router.use('/api/pages', PageApi);

// import AdminApi from '~/api/AdminApi';
// router.use('/api/admin', AdminApi);

import FileApi from '~/api/FileApi';
router.use('/api/files', FileApi);
