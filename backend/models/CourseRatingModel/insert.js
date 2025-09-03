import db from '#~/db/init.js';

const rate = ({ userId, courseId, rating }) =>
  db.one(
    `
      INSERT INTO course_rating
        (user_id, course_id, rating)
      VALUES
        (\${userId}, \${courseId}, \${rating})
      RETURNING *
    `,
    { userId, courseId, rating }
  );

export default { rate };
