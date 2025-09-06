import knex from '#~/db/knex.js';
import auth from '#~/middlewares/auth.js';

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
      promises.push(
        knex('notification').insert({ 
          type: 'someone_added_you_as_coauthor',
          content: {
            course,
            author: currentUser
          },
          userId: newUserId,
          ifRead: false
        })
      );
      
      // Mark that the user has unseen notifications
      promises.push(
        knex('user')
          .where({ id: newUserId })
          .update({ did_see_notifications: false })
      );
    }
  });

  await Promise.all(promises);

  response.success();
});

export default updateCoauthors;
