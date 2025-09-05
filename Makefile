
# _______________________________DEVELOPMENT_______________________________
start:
	NODE_ENV=development node_modules/.bin/nodemon --inspect --watch backend backend/index.js

frontend-webpack:
	cd frontend; NODE_OPTIONS="--openssl-legacy-provider" ../node_modules/.bin/webpack --config ./webpack/development.config.js -w

LOCAL_DB_URL = postgresql://memcode:memcode@localhost/memcode
LOCAL_POSTGRES_URL = postgresql://memcode:memcode@localhost/postgres
db-drop:
	psql $(LOCAL_POSTGRES_URL) -c 'DROP DATABASE IF EXISTS memcode'
db-reset:
	make db-drop
	psql $(LOCAL_POSTGRES_URL) -c 'CREATE DATABASE memcode'
	psql $(LOCAL_DB_URL) -f backend/db/schema.sql
db-migrate:
	psql $(LOCAL_DB_URL) -f backend/db/migrations/15.sql

# _______________________________PRODUCTION_______________________________
# ___Why don't we run `npm install`?
#    `npm install` is run automatically. since we need to compile code on heroku, we need our devDependencies installed too. so I set `heroku config:set NPM_CONFIG_PRODUCTION=false` for this purpose.
heroku-postbuild:
	touch env.js;
	make heroku-frontend-webpack &
	make heroku-meresei-frontend-webpack
heroku-deploy:
	git push heroku master
heroku-frontend-webpack:
	cd frontend; NODE_OPTIONS="--openssl-legacy-provider" ../node_modules/.bin/webpack --config ./webpack/production.config.js
heroku-meresei-frontend-webpack:
	cd meresei/frontend; npm install && npm run production

# ___Where did we get these credentials from?
#    Find our credentials from `heroku config`
# ___How to run a particular migration?
#    Manually input migration you want to run (eg 1.sql)
# ___Where is 7.sql taken from?
#    From local files!
heroku-db-migrate:
	psql $$(heroku config:get DATABASE_URL --app memcode) -f backend/db/migrations/15.sql
# when they ask for password - they ask for the local one (yes, 4 times)
heroku-db-pull:
	make db-drop
	heroku pg:pull DATABASE_URL memcode --app memcode
