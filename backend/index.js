import 'source-map-support/register';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

// load environment variables.
import '../env.js';

// inject router with middlewares and urls
import '~/beforeMiddleware';
import '~/api/urls';
import '~/afterMiddleware';

// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 3000;

import router from './router';
router.listen(port, (error) => {
  error ?
    console.log(`Server start error: ${error}`) :
    console.log(`Server is listening on port: ${port}`);
});
