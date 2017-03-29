import { db } from '~/db/init.js';

const update = {
  ifActive: (id, ifActive) =>
    db.one(
      "UPDATE course_user_is_learning \
      SET active = ${active} \
      WHERE id = ${id} \
      RETURNING *",
      { active: ifActive, id }
    )
};

export { update };
