import knex from '~/db/knex';

// Notification.insert.create({
//   type: 'someone_started_learning_your_course',
//   content: {},
//   userId
// })
const create = ({ type, content, userId }) =>
  knex('notification').insert({ type, content, userId, ifRead: false });

const someone_rated_your_course = async ({ raterId, courseId, rating }) => {
  const rater = (await knex('user').where({ id: raterId }))[0];
  const course = (await knex('course').where({ id: courseId }))[0];
  const courseAuthorId = course.userId;

  return create({
    type: 'someone_rated_your_course',
    content: {
      rating,
      raterId: rater.id,
      courseId: course.id,
      raterUsername: rater.username,
      raterAvatarUrl: rater.avatarUrl,
      courseTitle: course.title
    },
    userId: courseAuthorId
  });
};

const welcome_to_memcode = ({ userId }) =>
  create({
    type: 'welcome_to_memcode',
    content: {},
    userId
  });

const someone_started_learning_your_course = ({ learner, course }) =>
  create({
    type: 'someone_started_learning_your_course',
    content: {
      learnerId: learner.id,
      courseId: course.id,
      learnerUsername: learner.username,
      learnerAvatarUrl: learner.avatarUrl,
      courseTitle: course.title
    },
    userId: course.userId
  });

export default {
  create,
  welcome_to_memcode,
  someone_rated_your_course,
  someone_started_learning_your_course
};
