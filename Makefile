run:
	gnome-terminal \
		--tab -e 'make start' \
		--tab -e 'make backend-webpack' \
		--tab -e 'make frontend-webpack'

start:
	nodemon --inspect --watch backend backend/webpacked/index.js

# build and watch
backend-webpack:
	cd backend; ../node_modules/.bin/webpack -w
frontend-webpack:
	cd frontend; ../node_modules/.bin/webpack -w

# database
db-reset:
	# 'database=' here is a variable used in schema.sql (-v).
	psql -v database=memcode -U postgres -f backend/db/schema.sql

# dump and restore data
db-dump:
	pg_dump -o memcode -U postgres > backend/db/dump.sql
db-restore:
	psql -d memcode -U postgres < backend/db/dump.sql

# test
test-db-reset:
	psql -v database=memcode_test -U postgres -f backend/db/schema.sql
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

heroku-backend-webpack:
	cd backend; ../node_modules/.bin/webpack --config ./webpack.production.config.js
heroku-frontend-webpack:
	cd frontend; ../node_modules/.bin/webpack --config ./webpack.production.config.js

heroku-db-reset:
	psql -v database=d4atjhah7jcdbj -h ec2-54-235-119-27.compute-1.amazonaws.com -p 5432 -d d4atjhah7jcdbj -U rrorcwayzmpggy -f backend/db/schema.sql
