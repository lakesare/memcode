import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const webpackedFiles =
  express.static(path.join(__dirname, '../../frontend/webpackedFiles'));

export default webpackedFiles;
