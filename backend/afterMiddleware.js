import router from '#~/router.js';
import nocache from '#~/middlewares/nocache.js';

import html from '#~/html.js';
router.get('*', nocache(), (request, response) => response.send(html));

import handleErrors from '#~/middlewares/handleErrors.js';
router.use(handleErrors);

// import router from '#~/router';
// const path = require('path');
// 
// router.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../frontend/webpackedFiles/index.html'));
// });
// 
// import handleErrors from '#~/middlewares/handleErrors.js';
// router.use(handleErrors);
