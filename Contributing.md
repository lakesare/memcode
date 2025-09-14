# Contributing

First of all - you are welcome to contribute, Memcode is a joint effort.   
Feel free to ask questions/propose features in github issues, or email contact@memcode.com.

### One-Time Setup

#### Create a database

1. Install PostgreSQL (any modern should work, for example v14.17 and v16.9 certainly work)
2. Go to postgres console: `psql postgres` (as the default postgres superuser)
3. Create a `memcode` user with password: `CREATE ROLE memcode WITH LOGIN PASSWORD 'memcode';`.
4. Give the user permission to create databases: `ALTER ROLE memcode CREATEDB;`.
5. Create a new development database 'memcode': `make db-reset`. This will create the raw database for you - a schema and a few necessary database rows.

> [!NOTE]  
> The project uses a PostgreSQL user named `memcode` with password `memcode` for the database `memcode`. All database commands in the Makefile are configured to use these credentials.

#### Copypaste environment variables

1. Copy the example environment file with `cp env.example.js env.js`
   
   For basic development you do not need to change anything in this file.

#### Install the needed libraries

1. Install node v22.19.0
1. Install npm
2. Run `npm install`

### Development

1. Run `make frontend-webpack` (compiles the frontend code)
2. Run `make start` (starts the node server)
2. Go to <a href="http://localhost:3000/">http://localhost:3000</a>, and enjoy the development!  
   Locally, please use username&password to sign up.

<br/>
<div align="center">
  <img width="50px" src="https://user-images.githubusercontent.com/7578559/154219522-280c4f96-4e3d-45e9-9beb-671b339b3f92.png" alt="Memcode Logo"/>
</div>
