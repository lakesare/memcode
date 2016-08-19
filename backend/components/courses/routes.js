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

router.post('/', (request, response) => {
  response.json(request.body);
});

export { router };