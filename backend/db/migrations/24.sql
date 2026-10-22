-- [claude comment] Migration 24: colours given to page numbers in the reader's page grid, { "<page>": color }
ALTER TABLE pdf ADD COLUMN page_colors JSONB NOT NULL DEFAULT '{}';
