import knex from '~/db/knex';
import CourseModel from '~/models/CourseModel';

const getUserPage = async (request, response) => {
  const userId = request.body['userId'];
  const user = (await knex('user').where({ id: userId }))[0];
  // Only authenticated user should see the emails of other users
  const currentUser = request.currentUser || null;
  if (currentUser === null) {
    user.email = null;
  }

  // const coursesCreated = await knex('course').where({ userId });

  const coursesCreated = await CourseModel.select.allPublic({
    customWhere: `AND course.user_id=${userId}`
  });

  const skills =
    await knex('courseUserIsLearning')
      .select(knex.raw('count(problem_user_is_learning.id) as n, course_category.name'))
      .where({ active: true, 'courseUserIsLearning.userId': userId, 'problemUserIsLearning.ifIgnored': false })

      .join('problemUserIsLearning', { 'problemUserIsLearning.courseUserIsLearningId': 'courseUserIsLearning.id' })

      .join('course', { 'courseUserIsLearning.courseId': 'course.id' })

      .join('courseCategory', { 'course.courseCategoryId': 'courseCategory.id' })
      .groupBy('courseCategory.name');

  const skillsFormatted = skills.map((skill) => ({
    nOfFlashcards: parseInt(skill.n),
    categoryName: skill.name
  }));

  const skillsOrdered = skillsFormatted.sort((a, b) => {
    if (a.nOfFlashcards < b.nOfFlashcards) return 1;
    if (a.nOfFlashcards > b.nOfFlashcards) return -1;
    return 0;
  });

  const skillsOnly5 = skillsOrdered.slice(0, 5);

  response.success({ user, coursesCreated, skills: skillsOnly5 });
};

export default getUserPage;
