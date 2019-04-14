const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');
const sharedConfig = require('./sharedConfig');

module.exports = {
  entry: sharedConfig.entry,

  output: sharedConfig.output,

  module: sharedConfig.module,

  plugins: [
    ...sharedConfig._partialPlugins,
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new WebpackNotifierPlugin({
      alwaysNotify: true,
      excludeWarnings: true
    })
  ],

  resolve: sharedConfig.resolve,

  stats: {
    modules: false,
    maxModules: 0,
    children: false
  },

  mode: 'development'
};
