import knex from '#~/db/knex.js';
import catchAsync from '#~/services/catchAsync.js';

const getAll = catchAsync(async (request, response) => {
  const courseCategories = await knex('courseCategory');
  const courseCategoryGroups = await knex('courseCategoryGroup');

  response.success({ courseCategories, courseCategoryGroups });
});

export default getAll;
