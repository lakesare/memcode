-- http://stackoverflow.com/a/13318869/3192470
-- Database creation and switching handled by Makefile

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
SET timezone TO 'Etc/UTC';

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
  password_hash VARCHAR,
  did_see_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  duplicated_from_course_id INTEGER REFERENCES course (id) ON DELETE SET NULL DEFAULT NULL,
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
  position INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  course_id INTEGER REFERENCES course (id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE course_user_is_learning (
  id SERIAL PRIMARY KEY,

  active BOOLEAN NOT NULL,
  started_learning_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  course_id INTEGER REFERENCES course (id) ON DELETE CASCADE NOT NULL,
  user_id INTEGER REFERENCES "user" (id) ON DELETE CASCADE NOT NULL,
  unique (course_id, user_id)
);

-- this is the table only for already learned problems
CREATE TABLE problem_user_is_learning (
  id SERIAL PRIMARY KEY,

  easiness REAL NOT NULL,
  consecutive_correct_answers SMALLINT NOT NULL,
  next_due_date TIMESTAMPTZ NOT NULL,
  if_ignored BOOLEAN DEFAULT false,
  last_reviewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),

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
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  user_id INTEGER REFERENCES "user" (id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE course_rating (
  id SERIAL PRIMARY KEY,

  rating INTEGER CHECK (rating >= 1 AND rating <= 5),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  course_id INTEGER REFERENCES course (id) ON DELETE CASCADE NOT NULL,
  user_id INTEGER REFERENCES "user" (id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE coauthor (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  user_id INTEGER REFERENCES "user" (id) NOT NULL,
  course_id INTEGER REFERENCES course (id) ON DELETE CASCADE NOT NULL,

  unique (user_id, course_id)
);

CREATE TABLE stats_problem_review (
  id SERIAL PRIMARY KEY,
  problem_id INTEGER REFERENCES problem (id) ON DELETE SET NULL,
  user_id INTEGER REFERENCES "user" (id) ON DELETE CASCADE NOT NULL,
  was_correct BOOLEAN NOT NULL,
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Default category values
INSERT INTO "public"."course_category_group" ("id", "name") VALUES
('2', 'Hard Sciences'),
('3', 'Soft Sciences'),
('4', 'Languages');


INSERT INTO "public"."course_category" ("id", "name", "course_category_group_id") VALUES
('2', 'Mathematics', '2'),
('3', 'Physics', '2'),
('4', 'Biology', '2'),
('6', 'Programming Languages', '2'),
('7', 'Computer Science', '2'),
('8', 'Politics', '3'),
('9', 'Economics', '3'),
('10', 'Psychology', '3'),
('11', 'Law', '3'),
('12', 'History', '3'),
('13', 'Music', '3'),
('14', 'Literature', '3'),
('15', 'English', '4'),
('16', 'German', '4'),
('18', 'Spanish', '4'),
('19', 'Other', '4'),
('20', 'Philosophy', '3'),
('21', 'French', '4');
