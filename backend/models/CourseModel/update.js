import db from '#~/db/init.js';

const update = {
  update: (id, values) =>
    db.one(
      `
      UPDATE course
      SET
        title = \${title},
        description = \${description},
        if_public = \${ifPublic},
        course_category_id = \${courseCategoryId}
      WHERE id = \${id}
      RETURNING *
      `,
      {
        ...values,
        id
      }
    )
};

export default update;
