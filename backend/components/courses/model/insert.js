import { db } from '~/db/init.js';

const insert = {
  // course: {title: "aaa", userOauthId, userOauthProvider}
  // => { courseId: 5 }
  create: (course, userId) =>
    db.one(
      'INSERT INTO course (title, user_id) \
      VALUES (${title}, ${userId}) RETURNING id',
      {
        title: course.title,
        userId
      }
    )
    .then(createdCourse => createdCourse.id)
};

export { insert };
