import knex from '#~/db/knex.js';
import auth from '#~/middlewares/auth.js';
import NotificationModel from '#~/models/NotificationModel.js';

const updateCoauthors = auth(async (request, response) => {
  const currentUser = request.currentUser;
  const courseId = request.body['courseId'];
  const newUserIds = request.body['userIds'];

  const course = (await knex('course').where({ id: courseId }))[0];

  const oldCoauthors = await knex('coauthor').where({ courseId });

  const promises = [];

  oldCoauthors.forEach((oldCoauthor) => {
    const oldUserId = oldCoauthor.userId;
    // Should delete!
    if (!newUserIds.includes(oldUserId)) {
      promises.push(knex('coauthor').where({ courseId, userId: oldUserId }).del());
    }
  });

  newUserIds.forEach((newUserId) => {
    const coauthorAlreadyExists = oldCoauthors.find((oldCoauthor) =>
      oldCoauthor.userId === newUserId
    );
    if (!coauthorAlreadyExists) {
      promises.push(knex('coauthor').insert({ userId: newUserId, courseId }));
      // Create someone_added_you_as_coauthor notification
      promises.push(NotificationModel.create({ type: 'someone_added_you_as_coauthor', content: { course, author: currentUser }, userId: newUserId }));
    }
  });

  await Promise.all(promises);

  response.success();
});

export default updateCoauthors;
