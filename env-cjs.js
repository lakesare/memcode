// CommonJS version of env.js for webpack configuration compatibility
// This file exports the same environment variables as env.js but uses CommonJS syntax

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Set default environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3000;

// The webpack config just needs the environment variables to be available
// It doesn't need to import/export anything specific
module.exports = {};
