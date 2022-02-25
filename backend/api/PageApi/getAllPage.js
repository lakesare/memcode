import knex from '~/db/knex';
import canAccessCourse from '~/services/canAccessCourse';
import courseUserIsLearningModel from '~/models/CourseUserIsLearningModel/select/index';

const cantAccessError = "Sorry, this course is private. Only the author and coauthors and can access it.";

const getAllPage = async (request, response) => {
  const courseId = request.body['courseId'];

  if (!(await canAccessCourse(courseId, request.currentUser))) {
    return response.error(cantAccessError);
  }

  const courseUserIsLearning = (await knex('courseUserIsLearning')
    .where({ courseId, userId: request.currentUser.id }))[0];

  const problems = await courseUserIsLearningModel.selectAll(courseUserIsLearning.id);
  
  response.success({ courseUserIsLearning, problems });

};

export default getAllPage;
