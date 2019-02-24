-- http://stackoverflow.com/a/13318869/3192470
DROP DATABASE IF EXISTS :database;
CREATE DATABASE :database;

\c :database;

CREATE EXTENSION fuzzystrmatch;

-- always use "user" (double quotes) when you reference this table.
-- because 'user' is a reserved word in postgres, and it will complain about user table.
-- alternative are:
--   1. renaming table to eg profile/learner. but course_learner_learns or course_profile_learns don't sound good.
--   2. all tables are in sigular, but consider this an exception and user users. but exception of writing 'user' instead of user is no more tedious.
CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  oauth_provider VARCHAR NOT NULL,
  oauth_id VARCHAR NOT NULL,
  username VARCHAR NOT NULL,
  avatar_url VARCHAR,
  email TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT timezone('UTC', now()),
  unique (oauth_provider, oauth_id)
);

CREATE TABLE course_category_group (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL
);

INSERT INTO course_category_group (name)
VALUES ('Other');

CREATE TABLE course_category (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  course_category_group_id INTEGER REFERENCES course_category_group (id) ON DELETE CASCADE NOT NULL
);

INSERT INTO course_category (name, course_category_group_id)
VALUES ('Other', 1);


CREATE TABLE course (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL CHECK (char_length(title) >= 2),
  description TEXT,
  if_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT timezone('UTC', now()),

  user_id INTEGER REFERENCES "user" (id) ON DELETE CASCADE NOT NULL,
  course_category_id INTEGER REFERENCES course_category (id) ON DELETE SET DEFAULT DEFAULT 1
);

-- Hard Sciences
--   Mathematics
--   Physics
--   Astronomy
--   Biology
--   Programming Languages
--   Computer Science

-- Soft Sciences
--   Politics
--   Economics
--   Psychology
--   Law
--   History
--   Music
--   Literature

-- Languages
--   English
--   German
--   Swedish


CREATE TABLE problem (
  id SERIAL PRIMARY KEY,

  type VARCHAR NOT NULL,
  -- inlinedAnswers { content, explanation }
  -- separateAnswer { content, answer }
  content JSON,

  created_at TIMESTAMP NOT NULL,
  course_id INTEGER REFERENCES course (id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE course_user_is_learning (
  id SERIAL PRIMARY KEY,

  active BOOLEAN NOT NULL, -- whether it's shown in /courses/learning
  started_learning_at TIMESTAMP NOT NULL DEFAULT timezone('UTC', now()),

  course_id INTEGER REFERENCES course (id) ON DELETE CASCADE NOT NULL,
  user_id INTEGER REFERENCES "user" (id) ON DELETE CASCADE NOT NULL,
  unique (course_id, user_id)
);

-- this is the table only for already learned problems
CREATE TABLE problem_user_is_learning (
  id SERIAL PRIMARY KEY,

  easiness REAL NOT NULL,
  consecutive_correct_answers SMALLINT NOT NULL,
  next_due_date TIMESTAMP NOT NULL,
  if_ignored BOOLEAN DEFAULT false,
  last_reviewed_at TIMESTAMP NOT NULL DEFAULT timezone('UTC', now()),

  problem_id INTEGER REFERENCES problem (id) ON DELETE CASCADE NOT NULL,
  course_user_is_learning_id INTEGER REFERENCES "course_user_is_learning" (id) ON DELETE CASCADE NOT NULL,
  unique (problem_id, course_user_is_learning_id),
  CHECK (consecutive_correct_answers >= 0)
);

CREATE TABLE notification (
  id SERIAL PRIMARY KEY,
  -- someone_started_learning_your_course
  -- { learnerUsername, learnedAvatarUrl, learnerId, courseTitle, courseId }
  -- memcode_added_some_feature
  -- { html }
  -- welcome_to_memcode
  type VARCHAR NOT NULL,
  content JSON NOT NULL,
  if_read BOOLEAN NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT timezone('UTC', now()),

  user_id INTEGER REFERENCES "user" (id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE course_rating (
  id SERIAL PRIMARY KEY,

  rating INTEGER CHECK (rating >= 1 AND rating <= 5),

  created_at TIMESTAMP NOT NULL DEFAULT timezone('UTC', now()),
  updated_at TIMESTAMP NOT NULL DEFAULT timezone('UTC', now()),

  course_id INTEGER REFERENCES course (id) ON DELETE CASCADE NOT NULL,
  user_id INTEGER REFERENCES "user" (id) ON DELETE CASCADE NOT NULL
);
