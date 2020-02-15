import knex from '~/db/knex';
import catchAsync from '~/services/catchAsync';

const getAll = catchAsync(async (request, response) => {
  const courseCategories = await knex('courseCategory');
  const courseCategoryGroups = await knex('courseCategoryGroup');

  response.success({ courseCategories, courseCategoryGroups });
});

export default getAll;
