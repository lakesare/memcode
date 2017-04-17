import { db } from '~/db/init.js';

const update = {
  update: (id, values) =>
    db.one(
      `
      UPDATE course
      SET title = \${title},
          description = \${description},
          if_public = \${ifPublic}
      WHERE id = \${id}
      RETURNING *
      `,
      {
        ...values,
        id
      }
    )
};

export { update };
