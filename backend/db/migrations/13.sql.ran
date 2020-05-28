\c :database;

ALTER TABLE course
  ADD COLUMN duplicated_from_course_id INTEGER REFERENCES course (id) ON DELETE SET NULL DEFAULT NULL;
