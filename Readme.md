[Memcode.com](http://www.memcode.com/)

## How to set this up locally?

### Set up database
1. Install postgresql.
2. Go to postgres console: `psql postgres`.
3. Create a `postgres` user with password: CREATE ROLE postgres WITH LOGIN PASSWORD 'your password here'.
4. Give them a permission to create dbs, own all extensions etc.: `ALTER ROLE postgres with superuser;`.
5. Create a new development database 'memcode': `make db-reset`.

### Start code compilers and server.
1. Ask someone for `env.js` file, put it n the root (next to package.json). Change local DB_PASSWORD to relevant value.
3. Install npm, run `npm install`.
4. `make start`, `make backend-webpack`, `make frontend-webpack`

### Seed database.
1. Install heroku cli.
2. `heroku login`.
3. Make sure heroku knows about our app: `heroku git:remote -a memcode`.
4. Pull courses from the database with `make heroku-db-pull`.
