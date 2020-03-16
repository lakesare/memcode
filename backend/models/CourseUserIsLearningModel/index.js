// CREATE TABLE course_user_is_learning (
//   id SERIAL PRIMARY KEY,

//   active BOOLEAN,

//   course_id INTEGER REFERENCES course (id) ON DELETE CASCADE,
//   user_id INTEGER REFERENCES "user" (id) ON DELETE CASCADE,
//   unique (course_id, user_id)
// );

import select from './select';
import update from './update';

export default { select, update };
