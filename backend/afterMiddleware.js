import router from '~/router';

import html from '~/html';
router.get('*', (request, response) => response.send(html));

import handleErrors from '~/middlewares/handleErrors';
router.use(handleErrors);
