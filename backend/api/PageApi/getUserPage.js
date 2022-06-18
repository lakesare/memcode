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


  // Probably better to use raw sql here (https://stackoverflow.com/a/32544088/3192470)
  const getProgress = (betweenRange) =>
    knex('problemUserIsLearning')
      .count('problemUserIsLearning.id')
      .join('courseUserIsLearning', { 'problemUserIsLearning.courseUserIsLearningId': 'courseUserIsLearning.id' })
      .where({
        'courseUserIsLearning.active': true,
        'courseUserIsLearning.userId': userId,
        'problemUserIsLearning.ifIgnored': false
      })
      .whereBetween('problemUserIsLearning.easiness', betweenRange);

  // [0,    2.80] - short-term (will ask us to review in 0 - 9 days)
  // [2.81, 3.00] - middle-term (will ask us to review in 9 - 77 days)
  // [3.01,  inf] - long-term memory (will ask us to review 124 - inf days)
  const easiness = {
    shortTerm:  parseInt((await getProgress([0, 2.80]))[0].count),
    middleTerm: parseInt((await getProgress([2.81, 3.00]))[0].count),
    longTerm:   parseInt((await getProgress([3.01, 100]))[0].count)
  };

  const nOfProblemsLearned = easiness.shortTerm + easiness.middleTerm + easiness.longTerm;

  const nOfCoursesCreated = parseInt(
    (await knex('course').count().where({ userId }).whereNull('duplicatedFromCourseId'))[0].count);

  const stats = {
    easiness,
    nOfProblemsLearned,
    nOfCoursesCreated
  };

  response.success({ user, coursesCreated, skills: skillsOnly5, stats });
};

export default getUserPage;
