-- http://stackoverflow.com/a/13318869/3192470
DROP DATABASE IF EXISTS :database;
CREATE DATABASE :database;

\c :database;

CREATE TABLE users (
  oauth_provider VARCHAR,
  oauth_id VARCHAR,
  username VARCHAR,
  avatar_url VARCHAR,
  PRIMARY KEY (oauth_id, oauth_provider)
);

CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR,

  user_oauth_id VARCHAR,
  user_oauth_provider VARCHAR,
  FOREIGN KEY (user_oauth_id, user_oauth_provider) REFERENCES users (oauth_id, oauth_provider)
);

CREATE TABLE problems (
  id SERIAL PRIMARY KEY,
  explanation VARCHAR,

  type VARCHAR,
  content JSON,

  course_id INTEGER REFERENCES courses (id)
);



-- dropdb -U postgres memcode
-- createdb -U postgres memcode
-- psql -d memcode -U postgres -W -f backend/db/schema.sql