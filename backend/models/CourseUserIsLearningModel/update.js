import db from '#~/db/init.js';

const ifActive = (id, ifActiveOrNot) =>
  db.one(
    "UPDATE course_user_is_learning \
    SET active = ${active} \
    WHERE id = ${id} \
    RETURNING *",
    { active: ifActiveOrNot, id }
  );

export default { ifActive };
