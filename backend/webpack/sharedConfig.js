const fs = require('fs');
const path = require('path');

const nodeModules = {};
fs.readdirSync('../node_modules')
  .filter((x) => ['.bin'].indexOf(x) === -1)
  .forEach((mod) => {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  externals: nodeModules,
  _partialEntry: {
    // babel-polyfill for await async to work: http://stackoverflow.com/a/33527883/3192470
    index: ['babel-polyfill', './index']
  },
  target: 'node',
  // https://github.com/webpack/webpack/issues/1599#issuecomment-186841345
  // so that __dirname points at actual backend/webpacked/index.js, and we can reference how to serve our static frontend/webpacked files.
  node: {
    __dirname: false,
    __filename: false,
  },
  output: {
    path: path.join(__dirname, '../webpacked'),
    filename: '[name].js'
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
              presets: ['@babel/preset-env'],
              plugins: [
                "@babel/plugin-proposal-class-properties",
                ["@babel/plugin-proposal-decorators", { legacy: true }],
                "@babel/plugin-proposal-do-expressions",
                "@babel/plugin-proposal-export-default-from",
                "@babel/plugin-proposal-export-namespace-from",
                "@babel/plugin-proposal-function-bind",
                "@babel/plugin-proposal-function-sent",
                "@babel/plugin-proposal-json-strings",
                "@babel/plugin-proposal-logical-assignment-operators",
                "@babel/plugin-proposal-nullish-coalescing-operator",
                "@babel/plugin-proposal-numeric-separator",
                "@babel/plugin-proposal-optional-chaining",
                "@babel/plugin-proposal-throw-expressions"
              ]
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
    alias: { '~': path.resolve(__dirname, '../') }
  }
};
