const config = require('./webpack.config.js');
const webpack = require('webpack');

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
    ...config.plugins,
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
