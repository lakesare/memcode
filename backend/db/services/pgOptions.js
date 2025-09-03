import pgPromise from 'pg-promise';

/* eslint-disable */ // because it's taken from online source, may want to rewrite some time
const _camelizeColumns = (data) => {
  const template = data[0];
  for (let prop in template) {
    const camel = pgPromise.utils.camelize(prop);
    if (!(camel in template)) {
      data.map((d) => {
        d[camel] = d[prop];
        delete d[prop];
      });
    }
  }
};

const pgOptions = {
  query: (e) => {
    const cyan = "\x1b[36m%s\x1b[0m";
    console.log(cyan, e.query); // log the query being executed
  },
  // https://coderwall.com/p/irklcq
  receive: (data) => {
    _camelizeColumns(data);
  },
  // disable warnings for tests,
  // because it was complaining a lot about duplicated connection
  noWarnings: process.env.NODE_ENV === 'test'
};

export default pgOptions;
