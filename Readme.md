[Memcode.com](http://www.memcode.com/)

___

## For both development server and tests:

### Create a database postgres user with a password.
1. Install postgresql.
2. Go to postgres console: `psql postgres`.
3. Create a `postgres` user with password: CREATE ROLE postgres WITH LOGIN PASSWORD 'your password here'.
4. Give them a permission to create dbs, own all extensions etc.: `ALTER ROLE postgres with superuser;`.

___

## How to run a development site locally?

### Set up database
1. Create a new development database 'memcode': `make db-reset`.

### Start code compilers and server.
1. Ask someone for `env.js` file, put it n the root (next to package.json). Change local DB_USER and DB_PASSWORD to relevant value.
3. Install npm, run `npm install`.
4. `make start`, `make backend-webpack`, `make frontend-webpack`

### Optionally: populate database.
1. Install heroku cli.
2. `heroku login`.
3. Make sure heroku knows about our app: `heroku git:remote -a memcode`.
4. Pull courses from the database with `make heroku-db-pull`.

___

## How to run tests?

### Set up database
1. Create a new test database 'memcode_test': `make test-db-reset`.

### Start test-runners
1. `make test-backend` for backend, and `make test-frontend`. Both will be automatically compiling code in the runtime, so you don't need to bother with code compilers. Both run code in `**/*/... .test.js` file inside of, respectively, backend and frontend folders.
