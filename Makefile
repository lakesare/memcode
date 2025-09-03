
# _______________________________DEVELOPMENT_______________________________
start:
	NODE_ENV=development node_modules/.bin/nodemon --inspect --watch backend backend/index.js

frontend-webpack:
	cd frontend; NODE_OPTIONS="--openssl-legacy-provider" ../node_modules/.bin/webpack --config ./webpack/development.config.js -w

# database
db-drop:
	psql -U postgres -c 'DROP DATABASE IF EXISTS memcode'
db-reset:
	# 'database=' here is a variable used in schema.sql (-v).
	psql -v database=memcode -U postgres -f backend/db/schema.sql
db-migrate:
	psql -v database=memcode -U postgres -f backend/db/migrations/14.sql
# database: dump and restore data
db-dump:
	pg_dump -d memcode -U postgres > backend/db/dump.sql
db-restore:
	psql -d memcode -U postgres < backend/db/dump.sql

# _______________________________TEST_______________________________
test-db-reset:
	psql -v database=memcode_test -U postgres -f backend/db/schema.sql
test-backend:
	cd backend; NODE_ENV=test ../node_modules/.bin/mocha --recursive ./test
test-frontend:
	cd frontend; NODE_ENV=test ../node_modules/.bin/karma start

# _______________________________PRODUCTION_______________________________
# `npm install` is run automatically. since we need to compile code on heroku, we need our devDependencies installed too. so I set
# `heroku config:set NPM_CONFIG_PRODUCTION=false` for this purpose.
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

DB_URL = $$(heroku config:get DATABASE_URL --app memcode)
# ___Where did we get these credentials from?
#    Find our credentials from `heroku config`
# ___How to run a particular migration?
#    Manually input migration you want to run (eg 1.sql)
# ___Where is 7.sql taken from?
#    From local files!
heroku-db-migrate:
	psql -v database=d9glthq2q1grjs $(DB_URL) -f backend/db/migrations/14.sql
heroku-db-console:
	psql -v $(DB_URL)
# when they ask for password - they ask for the local one (yes, 4 times)
heroku-db-pull:
	make db-drop
	heroku pg:pull DATABASE_URL memcode --app memcode
