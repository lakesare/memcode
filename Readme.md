<div align="center">
  <a href="http://memcode.com" title="Website memcode.com"><img src="https://img.shields.io/website-up-down-green-red/http/shields.io.svg"/></a>
  <a href="https://GitHub.com/Naereen/lakesare/memcode/contributors/" title="GitHub contributors"><img src="https://img.shields.io/github/contributors/lakesare/memcode"/></a>
  <a href="https://github.com/lakesare/memcode/blob/master/LICENSE" title="GitHub license"><img src="https://img.shields.io/github/license/Naereen/StrapDown.js.svg"/></a>
  <a href="https://reactjs.org/docs/how-to-contribute.html#your-first-pull-request" title="PRs welcome"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"/></a>
  <a href="https://patreon.com/memcode" title="Donate to Memcode project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg"/></a>
</div>

<h1 align="center">
  Memcode
</h1>

<h2 align="center">
  Flashcards. Pretty. Open-source, free for all.
</h2>

<div align="center">
  <img width="950px" alt="Memcode Screenshot" src="https://user-images.githubusercontent.com/7578559/154212696-1597a568-7a97-44d8-bda9-56cc80fcc725.png">
</div>

## Links

**Website**: <a href="https://www.memcode.com">memcode.com</a>  
**Patreon**: <a href="https://patreon.com/memcode">patreon.com/memcode</a>   
**Email**:   contact@memcode.com    
**Twitter**: <a href="https://twitter.com/memcodeapp">twitter.com/memcodeapp</a>  
**Alternative.to**: <a href="https://alternativeto.net/software/memcode/about">alternativeto.net/software/memcode/about</a>    

## Contributing

First of all - you are very welcome to contribute, Memcode is a joint effort.   
Feel free to ask questions/propose features in github issues, or email contact@memcode.com.

### Setup

#### Create a database

1. Install PostgreSQL (any modern should work, for example v14.17 and v16.9 certainly work)
2. Go to postgres console: `psql postgres` (as the default postgres superuser)
3. Create a `memcode` user with password: `CREATE ROLE memcode WITH LOGIN PASSWORD 'memcode';`.
4. Give the user permission to create databases: `ALTER ROLE memcode CREATEDB;`.
5. Create a new development database 'memcode': `make db-reset`. This will create the raw database for you - a schema and a few necessary database rows.

**Note**: The project uses a PostgreSQL user named `memcode` with password `memcode` for the database `memcode`. All database commands in the Makefile are configured to use these credentials.

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
