-- [claude comment] Migration 25: the part of the page a bookmark covers, as fractions of the page height, once it was stretched by hand
ALTER TABLE pdf_bookmark ADD COLUMN region_top REAL, ADD COLUMN region_bottom REAL;
