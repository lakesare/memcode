import path from 'path';
import express from 'express';

const webpackedFiles =
  express.static(path.join(__dirname, '../../frontend/webpackedFiles'));

export default webpackedFiles;
