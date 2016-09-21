import express from 'express';
const router = express.Router();

import { db } from '../../db/init.js';
import * as Course from './model';

router.get('/:id', (request, response) => {
  Course.getCourseWithProblems(request.params.id)
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
  .catch((error) => {
    response.status(500).json({ error: error.message });
  })
});

router.post('/', (request, response) => {
  const result = Course.createCourseWithProblems(request.body["course"], request.body["problems"]);

  result.then((courseIdMap) => {
    response.status(200).json({ 
      data: courseIdMap
    });
  }).catch((error) => {
    response.status(500).json({ error: error.message });
  })
});

router.put('/:id', (request, response) => {
  const result = Course.updateCourseWithProblems(request.body["course"], request.body["problems"]);

  result.then((data) => {
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