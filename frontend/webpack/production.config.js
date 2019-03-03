const webpack = require('webpack');
const sharedConfig = require('./sharedConfig');

module.exports = {
  entry: sharedConfig.entry,
  output: sharedConfig.output,

  module: sharedConfig.module,
  plugins: [
    ...sharedConfig._partialPlugins,
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],

  resolve: sharedConfig.resolve,
  mode: 'production'
};
