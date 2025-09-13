import Knex from 'knex';
import knexStringcase from 'knex-stringcase';

import getConnectionString from './services/getConnectionString.js';

// ___Why are column names underscored?
//   Postgres lowercases all column names, and therefore returns { oauthid: 1 } from 'select * from' query, and I need oauthId.

// ___Why do we use 'timestamptz' instead of 'timestamp's?
//   Knex does not work well with 'timestamp's.
//   We should use 'timestamptz' - the timezone-aware type.
//   (https://github.com/knex/knex/issues/2094#issuecomment-305489801)
//   timestamptz always stores the date in utc, - and it converts it on its own.
const knex = Knex(knexStringcase({
  client: 'postgres',
  connection: getConnectionString(),
  pool: { min: 0, max: 7 },
  // debug: true,
  // asyncStackTraces: true
}));

export default knex;
