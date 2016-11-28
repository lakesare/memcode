import * as pgPromise from 'pg-promise';

// for pgOptions
const camelizeColumns = (data) => {
  const template = data[0];
  for (let prop in template) {
    const camel = pgPromise.utils.camelize(prop);
    if (!(camel in template)) {
      for (let i = 0; i < data.length; i++) {
        let d = data[i];
        d[camel] = d[prop];
        delete d[prop];
      }
    }
  }
};

const pgOptions = {
  query: (e) => {
    const cyan = "\x1b[36m%s\x1b[0m";
    console.log(cyan, e.query); // log the query being executed
  },
  receive: (data, result, e) => {
    camelizeColumns(data);
  } // https://coderwall.com/p/irklcq
};

const pgPackage = pgPromise.default(pgOptions);

const isTest = () => (process.env.NODE_ENV === 'test');

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