import express from 'express';
const router = express.Router();

import * as Course from './model';

import { authenticateMiddleware } from '~/middlewares/authenticate';


router.get('/:id', (request, response) => {
  Course.getCourseWithProblems(request.params.id)
    .then((data) => {
      response.status(200).json(data);
  }).catch((data) => {
      response.status(500).json({ error: data.message });
  });
});


// catch Async Await function's error
const catchAsync = asyncFunction =>
  (request, response, next) => {
    const promise = asyncFunction(request, response, next);
    promise.catch(error => next(error));
  };


router.get('/', catchAsync(async (request, response) => {
  const courses = await Course.getCourses();
  response.json(courses);
}));

router.use((error, request, response) => {
  console.error(error);
  response.status(500).json({ error: error.message });
});
















router.post('/', authenticateMiddleware, (request, response) => {
  const course = {
    ...request.body["course"],
    userOauthId: request.currentUser.oauthId,
    userOauthProvider: request.currentUser.oauthProvider
  };

  Course.createCourseWithProblems(course, request.body["problems"])
    .then((courseIdMap) => {
      response.status(200).json({ 
        data: courseIdMap
      });
    })
    .catch((error) => {
      response.status(500).json({ error: error.message });
    })
});

router.put('/:id', (request, response) => {
  const result = Course.updateCourseWithProblems(request.body["course"], request.body["problems"]);

  console.log("\n\n\n")
  const a = JSON.parse(JSON.stringify(request.body["course"]))
  const b = JSON.parse(JSON.stringify(request.body["problems"]))
  console.log("Course.createCourseWithProblems(");
  console.log(a)
  console.log(', ')
  console.log(b)
  console.log(')')
  console.log("\n\n\n")


  result.then(() => {
    response.status(200).json({ data: true });
  }).catch((error) => {
    response.status(500).json({ error: error.message });
  })
});

router.delete('/:id', (request, response) => {
  Course.deleteCourseWithProblems(request.params.id)
    .then(() => {
    response.status(200).json()
  }).catch((error) => {
    response.status(500).json(error)
  })
});



export { router };