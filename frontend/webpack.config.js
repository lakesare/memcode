const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template:  __dirname + '/index.html',
  inject: 'body'
});

// const WebpackErrorNotificationPlugin = require('webpack-error-notification');
// const WebpackErrorNotificationConfig = new WebpackErrorNotificationPlugin()//(/* strategy */, /* options */)

module.exports = {
  // devtool: 'source-map',
  entry: [
    './index.js'
  ],

  module: {
    loaders: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /(node_modules)/,
      },
      {
        test: /\.json$/,
        loader: 'json'
      }, // json-loader package is for marky (https://github.com/npm/marky-markdown#in-the-browser)
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['es2015', 'react', 'stage-0']
        }
      },
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        loaders: [
          'style',
          'css',
          'sass'
        ]
      }
    ],

  },

  // allows to import from the deep nested folders:
  // instead of: import '../../../../../services',
  // import '~/services'
  // idea from http://stackoverflow.com/questions/27502608/resolving-require-paths-with-webpack#comment60353452_35047907
  resolve: {
    alias: { '~': path.resolve(__dirname) }
  },

  plugins: [
    HTMLWebpackPluginConfig,
    // WebpackErrorNotificationConfig
  ],

  output: {
    filename: '/index.js',
    path: path.join(__dirname, '/webpacked')
  }
};
