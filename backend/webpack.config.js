const path = require('path');

const fs = require('fs');

const nodeModules = {};
fs.readdirSync('../node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });


const glob = require('glob');
const testFiles = glob.sync('./**/*.test.js', { ignore: './webpacked/**' });

const testEntries = {};
testFiles.forEach((testFile) => {
  testEntries['webpacked/test/' + testFile.slice(2, -3)] = testFile;
});

const entries = Object.assign(testEntries, {
  // babel-polyfill for await awsync to work: http://stackoverflow.com/a/33527883/3192470
  'webpacked/index': ['babel-polyfill', './index'],
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
    rules: [
      {
        test: /\.js$/,
        exclude: [/(node_modules)/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'stage-0']
            }
          },
          {
            loader: 'eslint-loader'
          }
        ]
      }
    ]
  },

  // allows to import from the deep nested folders:
  // instead of: import '../../../../../services',
  // import '~/services'
  // idea from http://stackoverflow.com/questions/27502608/resolving-require-paths-with-webpack#comment60353452_35047907
  resolve: {
    alias: { '~': path.resolve(__dirname) }
  },

  devtool: 'source-map', // check if works in webpack:backend
};
