___why column names are underscored?
  Postgres lowercases all column names, and therefore returns { oauthid: 1 } from 'select * from' query, and I need oauthId.

