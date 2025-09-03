import Knex from 'knex';
import knexStringcase from 'knex-stringcase';

import getConnectionString from './services/getConnectionString.js';

const knex = Knex(knexStringcase({
  client: 'postgres',
  connection: getConnectionString(),
  pool: { min: 0, max: 7 },
  // debug: true,
  // asyncStackTraces: true
}));

export default knex;
