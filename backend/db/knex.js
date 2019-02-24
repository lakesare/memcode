import Knex from 'knex';

import getConnectionString from './services/getConnectionString';

const knex = Knex({
  client: 'postgres',
  connection: getConnectionString(),
  pool: { min: 0, max: 7 }
});

export default knex;
