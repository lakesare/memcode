-- [claude comment] Migration 23: folders for /pdfs - the default folder is what the library shows when opened; books without a folder show under "All" only
CREATE TABLE pdf_folder (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  -- [claude comment] order of the folders, left to right
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX pdf_folder_user_id ON pdf_folder (user_id);

ALTER TABLE pdf ADD COLUMN folder_id INTEGER REFERENCES pdf_folder (id) ON DELETE SET NULL;
