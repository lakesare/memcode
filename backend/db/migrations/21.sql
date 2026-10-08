-- [claude comment] Migration 21: change counters for the offline copy (OfflineDuck.updateChangedCourses) - triggers rather than application code, so every write path bumps them (imports, moves, cascades, other devices)

-- [claude comment] changes whenever the course, its flashcards or its coauthors change
ALTER TABLE course
  ADD COLUMN content_version BIGINT NOT NULL DEFAULT 0;

-- [claude comment] changes whenever this user's learning of the course changes (reviews, learning, ignoring, schedule)
ALTER TABLE course_user_is_learning
  ADD COLUMN progress_version BIGINT NOT NULL DEFAULT 0;

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
