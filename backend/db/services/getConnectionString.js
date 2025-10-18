const getConnectionString = () => {
  switch (process.env.NODE_ENV) {
    // pgweb: postgres://postgres:§1§1§1@localhost:5432/memcode
    case 'development':
      return {
        host: process.env['DB_HOST'] || 'localhost',
        port: parseInt(process.env['DB_PORT']) || 5432,
        database: process.env['DB_NAME'] || 'memcode',
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
      // Use connection string + SSL object configuration (works for both pg-promise and knex)
      return {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
      };
  }
};

export default getConnectionString;
