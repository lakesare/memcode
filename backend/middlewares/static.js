// (global routes, because path.join didn't work after update to webpacked ES6)
// serve our static stuff like index.css
import express from 'express';

const staticAssets = express.static('/home/lakesare/Desktop/memcode/frontend/webpacked')

export { staticAssets };