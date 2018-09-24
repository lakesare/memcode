const config = require('./webpack.config.js');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: config.entry,

  module: {
    rules: [
      ...config.module.rules.filter(
        (rule) => String(rule.test) !== String(/\.js$/)
      ),
      {
        test: /\.js$/,
        exclude: /node_modules(?!\/quill-image-drop-module|quill-image-resize-module)/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react', 'stage-0'],
            plugins: ['transform-decorators-legacy']
          }
        }]
      },
    ]
  },

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
