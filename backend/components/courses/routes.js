import express from 'express';
const router = express.Router();

import { db } from '../../db/init.js';

router.get('/:id', (request, response) => {
  const problems = db.any('select * from problems where courseId = ${courseId}', 
    { 
      courseId: request.params.id
    })
  .then((data) => {
    response.status(200).json(data);
  })
  .catch((data) => {
    response.status(500).json({ error: data.message });
  })
});

router.get('/', (request, response) => {
  const courses = db.any("select * from courses")
  .then((data) => {
    response.status(200).json(data);
  })
  .catch((data) => {
    response.status(500).json({ error: data.message });
  })
});

import { createCourseWithProblems } from './model';

router.post('/', (request, response) => {
  const result = createCourseWithProblems(request.body["course"], request.body["problems"]);

  result.then((aaa) => {
    console.log({ data: aaa.data })
    response.status(200).json({ data: aaa.data });
  })

  // if (result.data) {
  //   response.status(200).json({ data: result.data });
  // } else if (result.error) {
  //   response.status(500).json({ error: result.error });
  // };



});

export { router };