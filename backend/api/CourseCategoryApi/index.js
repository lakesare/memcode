import express from 'express';
const router = express.Router();

import catchAsync from '~/services/catchAsync';

import CourseCategoryModel from '~/models/CourseCategoryModel';

router.get('/withGroups', catchAsync(async (request, response) => {
  const courseCategories = await CourseCategoryModel.select.all();
  const courseCategoryGroups = await CourseCategoryModel.select.allCourseCategoryGroups();

  response.status(200).json({ courseCategories, courseCategoryGroups });
}));

export default router;
