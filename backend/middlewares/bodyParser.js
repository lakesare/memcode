import bodyParser from 'body-parser';

const middleware = [
  bodyParser.json({ limit: '50mb' }), // to support JSON-encoded bodies
  bodyParser.urlencoded({
    limit: '50mb', // otherwise will complain about image upload
    extended: true,
    parameterLimit: 50000
  })
];

export default middleware;
