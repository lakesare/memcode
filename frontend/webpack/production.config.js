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
      // must NOT be process.env.NODE_ENV: 'production'!
      'DefinePlugin.NODE_ENV': JSON.stringify('production')
    })
  ],

  optimization: {
    minimize: true
  },

  resolve: sharedConfig.resolve,

  // must NOT be 'production', because some dumb ass library makes does
  // react-dom.production.min.js:198 RangeError: Maximum call stack size exceeded
  //     at objEquiv (index.js:43)
  //     at module.exports (index.js:26)
  mode: 'development'
};
