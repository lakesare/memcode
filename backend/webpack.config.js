var WebpackErrorNotificationPlugin = require('webpack-error-notification');
var WebpackErrorNotificationConfig = new WebpackErrorNotificationPlugin()//(/* strategy */, /* options */)

var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('../node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  externals: nodeModules,

  entry: {
    'webpacked/index': './index', // will be  ./build/application/bundle.js,
    'webpacked/seed': './db/seed'// will be  ./build/library/bundle.js
  },
  // https://github.com/webpack/webpack/issues/1189#issuecomment-156576084

  output: {
    path: './',
    filename: '[name].js'
  },







  target: 'node',

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['es2015', 'stage-0']
        }
      }
    ],

  },

  plugins: [
    WebpackErrorNotificationConfig
  ],

  // output: {
  //   filename: "/index.js",
  //   path: __dirname + '/webpacked'
  // }
}



// To fix this, run webpack -w and that will watch your files and re-execute webpack whenever any of the files Webpack is concerned about changes. 

// scss because used more than less & foundation because grid system's better than bootstraps