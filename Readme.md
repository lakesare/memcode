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
**Email**: [contact@memcode.com](mailto:contact@memcode.com)  
**Twitter**: https://twitter.com/memcodeapp  

**Alternative.to**: https://alternativeto.net/software/memcode/about   
**Slack**: please write to [contact@memcode.com](mailto:contact@memcode.com) to request access  


## Contributing

### Initial setup for development

Note: if you'd like to use online development environment, see https://github.com/lakesare/memcode/blob/master/Gitpod.md. Steps below are for local setup.

#### Create a database postgres user with a password.
1. Install PostgreSQL.
2. Go to postgres console: `psql postgres`.
3. Create a `postgres` user with password: `CREATE ROLE postgres WITH LOGIN PASSWORD postgres;`.
4. Give them a permission to create dbs, own all extensions etc.: `ALTER ROLE postgres with superuser;`.

#### Copypaste environment variables.
1. Ask someone for `env.js` file, put it in the root folder (next to package.json). Inside of `env.js`, change DB_USER and DB_PASSWORD to relevant values (your postgres's user and password).

#### Install the needed libraries.
1. Install npm.
2. Run `npm install`

#### Set up the database.
1. Create a new development database 'memcode': `make db-reset`.

#### Start code compilers and server.
1. Run `npm install`.
2. Run `make backend-webpack`, `make frontend-webpack`, `make start`.
