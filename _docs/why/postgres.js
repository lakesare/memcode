___why column names are underscored?
  Postgres lowercases all column names, and therefore returns { oauthid: 1 } from 'select * from' query, and I need oauthId.

___why do we use 'timestamptz' instead of 'timestamp's?
  Knex does not work well with 'timestamp's.
  We should use 'timestamptz' - the timezone-aware type.
  (https://github.com/knex/knex/issues/2094#issuecomment-305489801)
  timestamptz always stores the date in utc, - and it converts it on its own.
