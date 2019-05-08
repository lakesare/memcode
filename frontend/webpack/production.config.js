const webpack = require('webpack');
const sharedConfig = require('./sharedConfig');

// ___Why do we not have mode: 'production' set?
//    Explanation of mode: 'production' issue: https://github.com/reduxjs/react-redux/issues/1227#issuecomment-490681774
module.exports = {
  entry: sharedConfig.entry,

  output: sharedConfig.output,

  module: sharedConfig.module,

  plugins: [
    ...sharedConfig._partialPlugins,
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],

  optimization: {
    minimize: true
  },

  resolve: sharedConfig.resolve,

  mode: 'production'
};
