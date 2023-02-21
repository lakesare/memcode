\c :database;

CREATE TABLE student_group (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES "user" (id) ON DELETE CASCADE NOT NULL,
  title VARCHAR NOT NULL CHECK (char_length(title) >= 1),
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE student_in_group (
  id SERIAL PRIMARY KEY,
  student_group_id INTEGER REFERENCES "student_group" (id) ON DELETE CASCADE NOT NULL,
  user_id INTEGER REFERENCES "user" (id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  unique (student_group_id, user_id)
);

-- When the teacher creates some group of students,
-- they will see these students grouped in every course they create.
