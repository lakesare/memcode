all:
	ttab 'make start'
	ttab 'make backend-webpack'
	ttab 'make frontend-webpack'

# $(npm bin)/nodemon doesn't work, npm bin is '' then.
start:
	NODE_ENV=development node_modules/.bin/nodemon --inspect --watch backend backend/webpacked/index.js

# build and watch
backend-webpack:
	cd backend; ../node_modules/.bin/webpack -w
frontend-webpack:
	cd frontend; ../node_modules/.bin/webpack -w

# database
db-drop:
	psql -U postgres -c 'DROP DATABASE IF EXISTS memcode'
db-reset:
	# 'database=' here is a variable used in schema.sql (-v).
	psql -v database=memcode -U postgres -f backend/db/schema.sql
db-migrate:
	psql -v database=memcode -U postgres -f backend/db/migrations/8.sql

# dump and restore data
db-dump:
	pg_dump -o memcode -U postgres > backend/db/dump.sql
db-restore:
	psql -d memcode -U postgres < backend/db/dump.sql

# test
test-db-reset:
	psql -v database=memcode_test -U postgres -f backend/db/schema.sql
test-backend:
	cd backend; NODE_ENV=test ../node_modules/.bin/mocha --recursive ./webpacked/test --require babel-polyfill --require source-map-support/register
test-frontend:
	cd frontend; NODE_ENV=test ../node_modules/.bin/karma start

# production
heroku-postbuild:
	# npm install
	# is run automatically. since we need to compile code on heroku, we need our devDependencies installed too. so I set
	# heroku config:set NPM_CONFIG_PRODUCTION=false
	# for this purpose.
	touch env.js;
	make heroku-backend-webpack &
	make heroku-frontend-webpack

heroku-deploy:
	git push heroku master

heroku-backend-webpack:
	cd backend; ../node_modules/.bin/webpack --config ./webpack.production.config.js
heroku-frontend-webpack:
	cd frontend; ../node_modules/.bin/webpack --config ./webpack.production.config.js


DB_URL = $$(heroku config:get DATABASE_URL --app memcode)
# ___Where did we get these credentials from?
#    Find our credentials from `heroku config`
# ___How to run a particular migration?
#    Manually input migration you want to run (eg 1.sql)
# ___Where is 7.sql taken from?
#    From local files!
heroku-db-migrate:
	psql -v database=d9glthq2q1grjs $(DB_URL) -f backend/db/migrations/7.sql
heroku-db-console:
	psql -v $(DB_URL)

# when they ask for password - they ask for the local one (yes, 4 times)
heroku-db-pull:
	make db-drop
	PGUSER=postgres PGPASSWORD=§1§1§1 heroku pg:pull DATABASE_URL memcode --app memcode

# when they ask for password - they ask for the local one (yes, 4 times)
# heroku-pg-push:
# 	PGUSER=postgres heroku pg:reset DATABASE_URL
# 	PGUSER=postgres heroku pg:push memcode DATABASE_URL --app memcode
