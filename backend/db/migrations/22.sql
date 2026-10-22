-- [claude comment] Migration 22: /pdfs - pdf reader with marker highlights and bookmarks that get reviewed on a spaced schedule until removed
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
