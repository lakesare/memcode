import express from 'express';
const router = express.Router();

import { catchAsync } from '~/services/catchAsync';

import CourseCategoryModel from './model';

router.get('/withGroups', catchAsync(async (request, response) => {
  const courseCategories = await CourseCategoryModel.select.all();
  const courseCategoryGroups = await CourseCategoryModel.select.allCourseCategoryGroups();

  response.status(200).json({ courseCategories, courseCategoryGroups });
}));

// router.get('/withGroupsForUserLearning', catchAsync(async (request, response) => {
//   const courseCategories = await CourseCategoryModel.select.all();
//   const courseCategoryGroups = await CourseCategoryModel.select.allCourseCategoryGroups();

//   const userId = request.query.userId;

//   response.status(200).json({ courseCategories, courseCategoryGroups });
// }));

router.get('/seed', catchAsync(async (request, response) => {
  await CourseCategoryModel.insert.seed();
  response.status(200).json({});
}));

export default router;
