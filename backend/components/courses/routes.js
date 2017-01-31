import express from 'express';
const router = express.Router();

import { db } from '../../db/init.js';
import * as Course from './model';

router.get('/:id', (request, response) => {
  Course.getCourseWithProblems(request.params.id)
    .then((data) => {
      response.status(200).json(data);
  }).catch((data) => {
      response.status(500).json({ error: data.message });
  })
});

router.get('/', (request, response) => {
  const courses = db.any("select * from courses")
    .then((data) => {
      response.status(200).json(data);
  }).catch((error) => {
    response.status(500).json({ error: error.message });
  })
});

import jwt from 'jsonwebtoken';
const authenticate = (request, response, next) => {
  const token = request.headers['authorization'].split('Bearer ')[1];
  jwt.verify(token, 'our server secret', (error, user) => {
    if (error) {
      response.status(403).json({ error })
    } else {
      request.currentUser = user;
      next();
    }
  });
};

router.post('/', authenticate, (request, response) => {
  const course = {
    ...request.body["course"],
    user_oauth_id: request.currentUser.oauthId,
    user_oauth_provider: request.currentUser.oauthProvider
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