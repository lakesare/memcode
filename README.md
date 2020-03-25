Site ❤️: http://www.memcode.com/

Trello board: https://trello.com/b/UN0Vnv80/memcode (here you can see what we're working on, what features are to come, and what PRs are welcome)

[![Gitter](https://badges.gitter.im/kgisl/srs.svg)](https://gitter.im/kgisl/srs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

___

## Would you like some help with memcode?
- Write me at contact@memcode.com
- Open the issue in this repo

## Can you offer some help with memcode yourself?
You are very welcome to send a PR to this repository.

___

## Initial setup for development:

### Create a database postgres user with a password.
1. Install PostgreSQL.
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
