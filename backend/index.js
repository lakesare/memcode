import 'source-map-support/register';

// load environment variables.
import '../env.js';

import routes from '~/routes';

// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 3000;

routes.listen(port, (error) => {
  error ?
  console.log(`Server start error: ${error}`) :
  console.log(`Server is listening on port: ${port}`);
});
