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
  is_subscribed_to_marketing_emails BOOLEAN DEFAULT true NOT NULL,
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
  course_category_id INTEGER REFERENCES course_category (id) ON DELETE SET DEFAULT DEFAULT 1,

  -- [claude comment] changes whenever the course, its flashcards or its coauthors change (triggers below)
  content_version BIGINT NOT NULL DEFAULT 0
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

  -- [claude comment] review schedule, NULL hours = spaced repetition (services/repetitions.js)
  repeat_every_hours INTEGER DEFAULT NULL
    CHECK (repeat_every_hours IS NULL OR repeat_every_hours > 0),

  -- [claude comment] changes whenever this user's learning of the course changes (triggers below)
  progress_version BIGINT NOT NULL DEFAULT 0,

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
  -- [claude comment] NULL = learned, but never reviewed
  last_reviewed_at TIMESTAMPTZ DEFAULT NULL,

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

-- [claude comment] change counters for the offline copy (OfflineDuck.updateChangedCourses) - triggers rather than application code, so every write path bumps them (imports, moves, cascades, other devices)
CREATE FUNCTION bump_content_version() RETURNS trigger AS $$
BEGIN
  NEW.content_version := OLD.content_version + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bump_content_version
  BEFORE UPDATE ON course
  FOR EACH ROW EXECUTE FUNCTION bump_content_version();

CREATE FUNCTION bump_progress_version() RETURNS trigger AS $$
BEGIN
  NEW.progress_version := OLD.progress_version + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bump_progress_version
  BEFORE UPDATE ON course_user_is_learning
  FOR EACH ROW EXECUTE FUNCTION bump_progress_version();

-- [claude comment] for problem and coauthor rows - the UPDATE on course gets bumped by bump_content_version()
CREATE FUNCTION bump_content_version_of_course_id() RETURNS trigger AS $$
BEGIN
  IF TG_OP IN ('UPDATE', 'DELETE') THEN
    UPDATE course SET content_version = content_version WHERE id = OLD.course_id;
  END IF;
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.course_id <> OLD.course_id) THEN
    UPDATE course SET content_version = content_version WHERE id = NEW.course_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bump_content_version_of_course_id
  AFTER INSERT OR UPDATE OR DELETE ON problem
  FOR EACH ROW EXECUTE FUNCTION bump_content_version_of_course_id();

CREATE TRIGGER bump_content_version_of_course_id
  AFTER INSERT OR UPDATE OR DELETE ON coauthor
  FOR EACH ROW EXECUTE FUNCTION bump_content_version_of_course_id();

-- [claude comment] for problem_user_is_learning rows - the UPDATE on course_user_is_learning gets bumped by bump_progress_version()
CREATE FUNCTION bump_progress_version_of_course_user_is_learning_id() RETURNS trigger AS $$
BEGIN
  IF TG_OP IN ('UPDATE', 'DELETE') THEN
    UPDATE course_user_is_learning SET progress_version = progress_version WHERE id = OLD.course_user_is_learning_id;
  END IF;
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.course_user_is_learning_id <> OLD.course_user_is_learning_id) THEN
    UPDATE course_user_is_learning SET progress_version = progress_version WHERE id = NEW.course_user_is_learning_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bump_progress_version_of_course_user_is_learning_id
  AFTER INSERT OR UPDATE OR DELETE ON problem_user_is_learning
  FOR EACH ROW EXECUTE FUNCTION bump_progress_version_of_course_user_is_learning_id();

CREATE TABLE pdf (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  s3_key VARCHAR NOT NULL,
  size_bytes INTEGER NOT NULL,
  n_of_pages INTEGER,
  -- [claude comment] the reading position, set by the reader by hand ("Set as current"), y is a fraction of the page's height
  current_page INTEGER NOT NULL DEFAULT 1,
  current_y REAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_opened_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX pdf_user_id ON pdf (user_id);

-- [claude comment] y is a fraction of the page's height; archived_at is set once the place is understood and the bookmark is removed
CREATE TABLE pdf_bookmark (
  id UUID PRIMARY KEY,
  pdf_id INTEGER NOT NULL REFERENCES pdf (id) ON DELETE CASCADE,
  page INTEGER NOT NULL,
  y REAL NOT NULL,
  interval_days REAL NOT NULL DEFAULT 1,
  n_of_reviews INTEGER NOT NULL DEFAULT 0,
  next_due_at TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '1 day',
  last_reviewed_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  region_top REAL,
  region_bottom REAL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX pdf_bookmark_pdf_id ON pdf_bookmark (pdf_id);

-- [claude comment] points are [x, y] fractions of the page's width/height, width is a fraction of the page's height; bookmark_id is set for the strokes drawn while making that bookmark
CREATE TABLE pdf_highlight (
  id UUID PRIMARY KEY,
  pdf_id INTEGER NOT NULL REFERENCES pdf (id) ON DELETE CASCADE,
  bookmark_id UUID REFERENCES pdf_bookmark (id) ON DELETE SET NULL,
  page INTEGER NOT NULL,
  color VARCHAR NOT NULL,
  width REAL NOT NULL,
  points JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX pdf_highlight_pdf_id ON pdf_highlight (pdf_id);

CREATE TABLE pdf_folder (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX pdf_folder_user_id ON pdf_folder (user_id);

ALTER TABLE pdf ADD COLUMN folder_id INTEGER REFERENCES pdf_folder (id) ON DELETE SET NULL;

-- [claude comment] colours given to page numbers in the reader's page grid, { "<page>": color }
ALTER TABLE pdf ADD COLUMN page_colors JSONB NOT NULL DEFAULT '{}';

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
