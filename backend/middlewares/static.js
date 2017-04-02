// (global routes, because path.join didn't work after update to webpacked ES6)
// serves index.js, index.css.
import express from 'express';
import path from 'path';

const staticAssets = express.static(
  path.join(__dirname, '../..', '/frontend/webpacked'),
);

export { staticAssets };
