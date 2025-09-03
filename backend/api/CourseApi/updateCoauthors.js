import knex from '#~/db/knex.js';
import auth from '#~/middlewares/auth.js';
import NotificationModel from '#~/models/NotificationModel/index.js'

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
      promises.push(NotificationModel.insert.someone_added_you_as_coauthor({
        coauthorId: newUserId,
        course,
        author: currentUser
      }));
    }
  });

  await Promise.all(promises);

  response.success();
});

export default updateCoauthors;
