import express from 'express';

const middleware = [
  express.json({ limit: '50mb' }), // to support JSON-encoded bodies
  express.urlencoded({
    limit: '50mb', // otherwise will complain about image upload
    extended: true,
    parameterLimit: 50000
  })
];

export default middleware;
