import * as pgPromise from 'pg-promise';

const pgPackage = pgPromise.default({});

const isTest = () => {
  return(process.env.NODE_ENV === 'test')
}

const connectionString = {
  host: 'localhost', // 'localhost' is the default;
  port: 5432, // 5432 is the default;
  database: (isTest() ? 'memcode_test' : 'memcode'),
  user: 'postgres',
  password: '`1`1`1'
};
const db = pgPackage(connectionString);
db.connect()
  .then(function (obj) {
    obj.done(); // success, release the connection;
  })
  .catch(function (error) {
    console.log("ERROR:", error.message || error);
});


export { db };