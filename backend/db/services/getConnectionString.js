const getConnectionString = () => {
  switch (process.env.NODE_ENV) {
    // pgweb: postgres://postgres:§1§1§1@localhost:5432/memcode
    case 'development':
      return {
        host: 'localhost', // 'localhost' is the default;
        port: 5432, // 5432 is the default;
        database: 'memcode',
        user: process.env['DB_USER'],
        password: process.env['DB_PASSWORD']
      };
    case 'test':
      return {
        host: 'localhost', // 'localhost' is the default;
        port: 5432, // 5432 is the default;
        database: 'memcode_test',
        user: process.env['DB_USER'],
        password: process.env['DB_PASSWORD']
      };
    case 'production':
      // this variable is set automatically after we do heroku addons:create heroku-postgresql:hobby-dev
      // Parse the DATABASE_URL and add SSL configuration
      const url = new URL(process.env.DATABASE_URL);
      return {
        host: url.hostname,
        port: url.port,
        database: url.pathname.slice(1), // remove leading slash
        user: url.username,
        password: url.password,
        ssl: {
          rejectUnauthorized: false
        }
      };
  }
};

export default getConnectionString;
