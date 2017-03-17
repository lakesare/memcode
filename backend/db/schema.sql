-- http://stackoverflow.com/a/13318869/3192470
DROP DATABASE IF EXISTS :database;
CREATE DATABASE :database;

\c :database;

-- always use "user" (double quotes) when you reference this table.
-- because 'user' is a reserved word in postgres, and it will complain about user table.
-- alternative are:
--   1. renaming table to eg profile/learner. but course_learner_learns or course_profile_learns don't sound good.
--   2. all tables are in sigular, but consider this an exception and user users. but exception of writing 'user' instead of user is no more tedious.
CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  oauth_provider VARCHAR,
  oauth_id VARCHAR,
  username VARCHAR,
  avatar_url VARCHAR
);

CREATE TABLE course (
  id SERIAL PRIMARY KEY,
  title VARCHAR,

  user_id INTEGER REFERENCES "user" (id) ON DELETE CASCADE
);

CREATE TABLE problem (
  id SERIAL PRIMARY KEY,
  type VARCHAR,

  explanation JSON,
  content JSON,

  created_at TIMESTAMP,

  course_id INTEGER REFERENCES course (id) ON DELETE CASCADE
);

CREATE TABLE course_user_is_learning (
  id SERIAL PRIMARY KEY,

  problem_scores JSON,

  active BOOLEAN, -- whether it's shown in /profile/learning

  course_id INTEGER REFERENCES course (id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES "user" (id) ON DELETE CASCADE,
  unique (course_id, user_id)
);
