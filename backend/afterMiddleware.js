import router from '~/router';
import nocache from '~/middlewares/nocache';

import html from '~/html';
router.get('*', nocache(), (request, response) => response.send(html));

import handleErrors from '~/middlewares/handleErrors';
router.use(handleErrors);

// import router from '~/router';
// const path = require('path');
// 
// router.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../frontend/webpackedFiles/index.html'));
// });
// 
// import handleErrors from '~/middlewares/handleErrors';
// router.use(handleErrors);
