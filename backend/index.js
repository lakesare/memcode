import 'source-map-support/register.js';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
dayjs.extend(relativeTime);

// load environment variables.
import '../env.js';

// inject router with middlewares and urls
import '#~/beforeMiddleware.js';
import '#~/api/urls.js';
import '#~/afterMiddleware.js';

// =============================================================================
// MERESEI + MEMCODE INTEGRATION (comment out sections to work on specific app)
// =============================================================================

// Meresei integration
import express from 'express';
import vhost from "#~/middlewares/vhost.js";
import mereseiRouter from '../meresei/backend/mereseiRouter.js';

// Main app with vhost routing
const app = express();

// Route meresei.com to meresei app

app.use(vhost('meresei.com', mereseiRouter));
app.use(vhost('www.meresei.com', mereseiRouter));

// =============================================================================
// FOR LOCAL DEVELOPMENT: uncomment this section to work on meresei
// =============================================================================
// app.use(mereseiRouter);
// =============================================================================

import router from './router.js';
app.use(router);

// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 3000;

app.listen(port, (error) => {
  error ?
    console.log(`Server start error: ${error}`) :
    console.log(`Server is listening on port: ${port}`);
});
