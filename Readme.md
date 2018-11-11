[Memcode.com](http://www.memcode.com/)

___

## Initial one-time steps for both development and testing:

### Create a database postgres user with a password.
1. Install postgresql.
2. Go to postgres console: `psql postgres`.
3. Create a `postgres` user with password: CREATE ROLE postgres WITH LOGIN PASSWORD 'your password here'.
4. Give them a permission to create dbs, own all extensions etc.: `ALTER ROLE postgres with superuser;`.

### Copypaste environment variables.
1. Ask someone for `env.js` file, put it in the root folder (next to package.json). Inside of `env.js`, change DB_USER and DB_PASSWORD to relevant values (your postgres's user and password).

### Install needed libraries.
1. Install npm.

___

## How to run a development site locally?

### Set up database
1. Create a new development database 'memcode': `make db-reset`.

### Start code compilers and server.
1. Run `npm install`.
2. `make start`, `make backend-webpack`, `make frontend-webpack`

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
1. Run `npm install`.
2. `make test-backend` for backend, and `make test-frontend`. Both will be automatically compiling code in the runtime, so you don't need to bother with code compilers. Both run code in `**/*/... .test.js` file inside of, respectively, backend and frontend folders.

___

## Possible refactoring

- change next_due_date_in to next_due_date_diff_from_now (all PostgresInterval kind of objects should be suffixed _diff_from_now)
- move /api/commonFetch to /api/services/commonFetch
