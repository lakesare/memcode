# eveything needed for development
# I don't know how to make them not close an entire tab on CTRL+Z
# docs: https://www.systutorials.com/docs/linux/man/1-gnome-terminal/
all:
	gnome-terminal \
		--tab -e 'make start' \
		--tab -e 'make backend-webpack' \
		--tab -e 'make frontend-webpack'

# $(npm bin)/nodemon doesn't work, npm bin is '' then.
start:
	NODE_ENV=development node_modules/.bin/nodemon --inspect --watch backend backend/webpacked/index.js

# build and watch
backend-webpack:
	cd backend; ../node_modules/.bin/webpack -w
frontend-webpack:
	cd frontend; ../node_modules/.bin/webpack -w

user = kirill
db = memcode
# database
db-setup:
	createdb $(db)
db-drop:
	psql -U $(user) -c 'DROP DATABASE IF EXISTS $(db)'
db-reset:
	# 'database=' here is a variable used in schema.sql (-v).
	psql -v database=$(db) -d $(db) -U $(user) -f backend/db/schema.sql
db-migrate:
	psql -v database=$(db) -d $(db) -U $(user) -f backend/db/migrations/2.sql

# dump and restore data
db-dump:
	pg_dump -o $(db) -U $(user) > backend/db/dump.sql
db-restore:
	psql -d $(db) -U $(user) < backend/db/dump.sql

# test
test-db-reset:
	psql -v database=memcode_test -U $(user) -f backend/db/schema.sql
test-backend:
	cd backend; NODE_ENV=test mocha --recursive ./webpacked/test --require babel-polyfill --watch
test-frontend:
	cd frontend; NODE_ENV=test karma start

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

heroku-db-reset:
	psql -v database=d4atjhah7jcdbj -h ec2-54-235-119-27.compute-1.amazonaws.com -p 5432 -d d4atjhah7jcdbj -U rrorcwayzmpggy -f backend/db/schema.sql

# manually input migration you want to run (eg 1.sql)
heroku-db-migrate:
	psql -v database=d4atjhah7jcdbj -h ec2-54-235-119-27.compute-1.amazonaws.com -p 5432 -d d4atjhah7jcdbj -U rrorcwayzmpggy -f backend/db/migrations/2.sql
heroku-db-console:
	psql -v database=d4atjhah7jcdbj -h ec2-54-235-119-27.compute-1.amazonaws.com -p 5432 -d d4atjhah7jcdbj -U rrorcwayzmpggy

# when they ask for password - they ask for the local one (yes, 4 times)
heroku-db-pull:
	make db-drop
	PGUSER=postgres heroku pg:pull DATABASE_URL memcode

# when they ask for password - they ask for the local one (yes, 4 times)
heroku-pg-push:
	PGUSER=postgres heroku pg:reset DATABASE_URL
	PGUSER=postgres heroku pg:push memcode DATABASE_URL --app memcode
