const path = require('path');
const fs = require('fs');

const nodeModules = {};
fs.readdirSync('../node_modules')
  .filter((x) =>
    ['.bin'].indexOf(x) === -1
  )
  .forEach((mod) => {
    nodeModules[mod] = 'commonjs ' + mod;
  });

const glob = require('glob');
const testFiles = glob.sync('./**/*.test.js', { ignore: './webpacked/**' });

const testEntries = {};
testFiles.forEach((testFile) => {
  testEntries['test/' + testFile.slice(2, -3)] = testFile;
});

const entries = Object.assign(testEntries, {
  // babel-polyfill for await async to work: http://stackoverflow.com/a/33527883/3192470
  index: ['babel-polyfill', './index'],
  seed: './db/seed',
});

module.exports = {
  externals: nodeModules,

  // https://github.com/webpack/webpack/issues/1189#issuecomment-156576084
  entry: entries,

  output: {
    path: path.join(__dirname, '/webpacked'),
    filename: '[name].js'
  },

  target: 'node',

  // https://github.com/webpack/webpack/issues/1599#issuecomment-186841345
  // so that __dirname points at actual backend/webpacked/index.js, and we can reference how to serve our static frontend/webpacked files.
  node: {
    __dirname: false,
    __filename: false,
  },

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
