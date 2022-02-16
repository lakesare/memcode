<div align="center">
  <a href="http://memcode.com" title="Website memcodec.com">
    <img src="https://img.shields.io/website-up-down-green-red/http/shields.io.svg"/>
  </a>
  
  <a href="https://GitHub.com/Naereen/lakesare/memcode/contributors/" title="GitHub contributors">
    <img src="https://img.shields.io/github/contributors/lakesare/memcode"/>
  </a>
  
  <a href="https://github.com/lakesare/memcode/blob/master/LICENSE" title="GitHub license">
    <img src="https://img.shields.io/github/license/Naereen/StrapDown.js.svg"/>
  </a>
  
  <a href="https://reactjs.org/docs/how-to-contribute.html#your-first-pull-request" title="PRs welcome">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"/>
  </a>

  <a href="https://gitpod.io/#https://github.com/lakesare/memcode" title="Gitpod Ready-to-Code">
    <img src="https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod"/>
  </a>


  <a href="https://patreon.com/memcode" title="Donate to Memcode project using Patreon">
    <img src="https://img.shields.io/badge/patreon-donate-yellow.svg"/>
  </a>
</div>

<h1 align="center">
  Memcode
</h1>

<h2 align="center">
  Flashcards for coders and scientists. Open-source, free for all.
</h2>


<img alt="image" src="https://user-images.githubusercontent.com/7578559/154212696-1597a568-7a97-44d8-bda9-56cc80fcc725.png">

## Links

**Site**: www.memcode.com  
**Patreon**: www.patreon.com/memcode  
**Email**: **contact@memcode.com** 
**Twitter**: https://twitter.com/memcodeapp  

**Alternative.to**: https://alternativeto.net/software/memcode/about   
**Slack**: To join developer Slack, please write to [contact@memcode.com](mailto:contact@memcode.com).

## Contributing

First of all - you are very welcome to contribute, Memcode is a joint effort.

Note: if you'd like to use online development environment, see https://github.com/lakesare/memcode/blob/master/Gitpod.md. Steps below are for the local setup.

#### Create a database postgres user with a password.
1. Install PostgreSQL.
2. Go to postgres console: `psql postgres`.
3. Create a `postgres` user with password: `CREATE ROLE postgres WITH LOGIN PASSWORD postgres;`.
4. Give the user a permission to create dbs, own all extensions, etc.: `ALTER ROLE postgres with superuser;`.

#### Copypaste environment variables.
1. **Either** copy the example environment file with `cp env.example.js env.js`, and insert the required values yourself,
2. **Or** write to **contact@memcode.com** and I will send you a ready `env.js` file.
In either case, you will need to insert your own `DB_USER` and `DB_PASSWORD` that you created in the previous step.

#### Install the needed libraries.
1. Install npm.
2. Run `npm install`

#### Set up the database.
1. Create a new development database 'memcode': `make db-reset`.
This will create the raw database for you - schema, a few necessary database rows, and nothing else.
If you would like a bigger database to have something to work with, please write to **contact@memcode.com**, and I will create a development dump for you.

#### Start code compilers and server.
1. Run `make all` in your terminal.
This will start:
- `make backend-webpack` (compiles the backend code on every change)
- `make frontend-webpack` (compiles the frontend code on every change)
- `make start` (starts the node server)
for you.  
You can also run these separately if you wish to see the individual output.
2. Go to <a href="http://localhost:3000/">http://localhost:3000</a>, and enjoy the development!
