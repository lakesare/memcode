DROP DATABASE memcode;
CREATE DATABASE memcode;

\c memcode;

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