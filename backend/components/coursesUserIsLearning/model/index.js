// CREATE TABLE course_user_is_learning (
//   id SERIAL PRIMARY KEY,

//   active BOOLEAN,

//   course_id INTEGER REFERENCES course (id) ON DELETE CASCADE,
//   user_id INTEGER REFERENCES "user" (id) ON DELETE CASCADE,
//   unique (course_id, user_id)
// );

import { select } from './select';
import { insert } from './insert';
import { update } from './update';

export { select, insert, update };
