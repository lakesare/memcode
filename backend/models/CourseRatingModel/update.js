import db from '~/db/init.js';

const rate = ({ id, rating }) =>
  db.one(
    `
      UPDATE course_rating
      SET rating = \${rating}
      WHERE id = \${id}
      RETURNING *
    `,
    { id, rating }
  );

export default { rate };
