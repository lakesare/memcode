import * as pgPromise from 'pg-promise';

import pgOptions from './services/pgOptions.js';
import getConnectionString from './services/getConnectionString.js';

const pgPackage = pgPromise.default(pgOptions);

const db = pgPackage(getConnectionString());

db.connect()
  .then((obj) => {
    obj.done();
  })
  .catch((error) => {
    console.log("ERROR:", error.message || error);
  });

export default db;
