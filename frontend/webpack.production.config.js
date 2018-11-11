const config = require('./webpack.config.js');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: config.entry,

  module: config.module,

  resolve: config.resolve,

  plugins: [
    new ExtractTextPlugin('/index.css'),
    new webpack.ProvidePlugin({
      React: 'react',
      PropTypes: 'prop-types',
      'window.Quill': 'quill',
      connect: ['react-redux', 'connect']
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],

  output: config.output
};
