import db from '#~/db/init.js';

const update = {
  update: (id, email) =>
    db.one(
      `
        UPDATE "user"
        SET email = \${email}
        WHERE id = \${id}
        RETURNING *
      `,
      { id, email }
    )
};

export default update;
