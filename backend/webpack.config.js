var WebpackErrorNotificationPlugin = require('webpack-error-notification');
var WebpackErrorNotificationConfig = new WebpackErrorNotificationPlugin()

var fs = require('fs');

var nodeModules = {};
fs.readdirSync('../node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
});


var glob = require("glob")
var testFiles = glob.sync("./**/*.test.js", { ignore: "./webpacked/**" })

var testEntries = {}
testFiles.forEach(function(testFile) {
  testEntries['webpacked/test/' + testFile.slice(2, -3)] = testFile
});
console.log(testFiles)

var entries = Object.assign(testEntries, {
  'webpacked/index': './index',
  'webpacked/seed': './db/seed',
});

module.exports = {
  externals: nodeModules,

  entry: entries,
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

  devtool: 'source-map', // check if works in webpack:backend

  plugins: [
    WebpackErrorNotificationConfig
  ]
}
