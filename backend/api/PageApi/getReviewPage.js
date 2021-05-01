import knex from '~/db/knex';
import canAccessCourse from '~/services/canAccessCourse';

import CourseUserIsLearningModel from '~/models/CourseUserIsLearningModel';
const cantAccessError = "Sorry, this course is private. Only the author and coauthors and can access it.";

const getReviewPage = async (request, response) => {
  const courseId = request.body['courseId'];

  if (!(await canAccessCourse(courseId, request.currentUser))) {
    return response.error(cantAccessError);
  }

  const courseUserIsLearning = (await knex('courseUserIsLearning')
    .where({ courseId, userId: request.currentUser.id }))[0];
  const problems = await CourseUserIsLearningModel.select.problemsToReview(courseUserIsLearning.id);
  response.success({ courseUserIsLearning, problems });
};

export default getReviewPage;
