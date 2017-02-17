import express from 'express';
const router = express.Router();

import * as Problem from './model';

router.delete('/:id', (request, response) => {
  Problem.deleteProblem(request.params.id)
    .then(() => {
    response.status(200).json()
  }).catch((error) => {
    response.status(500).json(error)
  })
});

export { router };
