// CREATE TABLE course (
//   id SERIAL PRIMARY KEY,
//   title VARCHAR NOT NULL,

//   user_id INTEGER REFERENCES "user" (id) ON DELETE CASCADE NOT NULL
// );

import { select } from './select';
import { insert } from './insert';
import { update } from './update';
import { ddelete } from './ddelete';

export { select, insert, update, ddelete };
