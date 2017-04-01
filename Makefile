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
	psql -v database=memcode -U postgres -f backend/db/schema.sql

# dump and restore data
db-dump:
	pg_dump -o memcode -U postgres > backend/db/dump.sql
db-restore:
	psql -d memcode -U postgres < backend/db/dump.sql

# test
db-reset-test:
	psql -v database=memcode_test -U postgres -f backend/db/schema.sql
backend-test:
	cd backend; NODE_ENV=test mocha --recursive ./webpacked/test --require babel-polyfill --watch
frontend-test:
	cd frontend; NODE_ENV=test karma start
