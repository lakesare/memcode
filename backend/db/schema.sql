-- http://stackoverflow.com/a/13318869/3192470
DROP DATABASE IF EXISTS :database;
CREATE DATABASE :database;

\c :database;

CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR
);

CREATE TABLE problems (
  id SERIAL PRIMARY KEY,
  explanation VARCHAR,

  type VARCHAR,
  content JSON,

  courseId integer REFERENCES courses (id)
);

-- dropdb -U postgres memcode
-- createdb -U postgres memcode
-- psql -d memcode -U postgres -W -f backend/db/schema.sql