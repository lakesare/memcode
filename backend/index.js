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

// =============================================================================
// MERESEI + MEMCODE INTEGRATION (comment out sections to work on specific app)
// =============================================================================

// Meresei integration
import express from 'express';
import vhost from "~/middlewares/vhost";
import mereseiRouter from '../meresei/backend/mereseiRouter';

// Main app with vhost routing
const app = express();

// Route meresei.com to meresei app
app.use(vhost('meresei.com', mereseiRouter));
app.use(vhost('www.meresei.com', mereseiRouter));
app.use(vhost('https://www.meresei.com', mereseiRouter));
app.use(vhost('https://meresei.com', mereseiRouter));

// =============================================================================
// FOR LOCAL DEVELOPMENT: Comment/uncomment these sections as needed
// =============================================================================

// OPTION 1: Work on MERESEI (uncomment this, comment out memcode section below)
// if (process.env.NODE_ENV !== 'production') {
//   app.use(mereseiRouter);
// }

// OPTION 2: Work on MEMCODE (uncomment this, comment out meresei section above)
// Default to memcode router
import router from './router';
app.use(router);

// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 3000;

app.listen(port, (error) => {
  error ?
    console.log(`Server start error: ${error}`) :
    console.log(`Server is listening on port: ${port}`);
});
