import router from '~/router';

import authenticate from '~/middlewares/authenticate';
import catchAsync from '~/services/catchAsync';


// TODO make all routes like CourseApi.rate()
import CourseApi from '~/api/CourseApi';
router.use('/api/courses', CourseApi);
import rate from '~/api/CourseApi/rate';
router.put('/api/courses/:id/rate', authenticate, catchAsync(rate));


import NotificationApi from '~/api/NotificationApi';


import TestApi from '~/api/TestApi';

// request.params - { controllerName: 'CourseApi', methodName: 'getPublicCourses' }
router.post('/api/:controllerName.:methodName', catchAsync(async (request, response, next) => {
  switch (request.params.controllerName) {
    // CourseApi.getPublicCourses(request, response)
    case 'CourseApi': await TestApi[request.params.methodName](request, response, next); break;
    case 'NotificationApi': await NotificationApi[request.params.methodName](request, response, next); break;
  }
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
